import { bookingTimes, validDate } from '../src/booking-rules'
interface Statement {
  bind(...values: unknown[]): Statement
  first<T = Record<string, unknown>>(): Promise<T | null>
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>
  run(): Promise<{ meta: { changes: number } }>
}
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
  DB?: { prepare(sql: string): Statement }
  ADMIN_TOKEN?: string
  TURNSTILE_ENABLED?: string
  TURNSTILE_SECRET_KEY?: string
  TURNSTILE_SITE_KEY?: string
  LOCAL_DEVELOPMENT?: string
}
const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag': 'noindex',
    },
  })
const digest = async (value: string) =>
  [
    ...new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)),
    ),
  ]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
async function equalSecret(a: string, b: string) {
  const [x, y] = await Promise.all([digest(a), digest(b)])
  let difference = 0
  for (let i = 0; i < x.length; i++)
    difference |= x.charCodeAt(i) ^ y.charCodeAt(i)
  return difference === 0
}
async function limited(
  env: Env,
  request: Request,
  bucket: string,
  max: number,
) {
  const window = Math.floor(Date.now() / 600000)
  const key = await digest(
    `${bucket}:${request.headers.get('CF-Connecting-IP') ?? 'local'}:${window}`,
  )
  const row = await env
    .DB!.prepare(
      'INSERT INTO request_limits(key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count',
    )
    .bind(key, (window + 1) * 600)
    .first<{ count: number }>()
  return (row?.count ?? max + 1) > max
}
async function readBody(request: Request) {
  if (!request.headers.get('Content-Type')?.startsWith('application/json'))
    throw new Error('content-type')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('body')
  let size = 0
  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > 8192) {
      await reader.cancel()
      throw new Error('size')
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  const value = JSON.parse(new TextDecoder().decode(bytes))
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('body')
  return value as Record<string, unknown>
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request)
    try {
      const local =
        env.LOCAL_DEVELOPMENT === 'true' &&
        ['localhost', '127.0.0.1'].includes(url.hostname)
      const requireTurnstile = !local && env.TURNSTILE_ENABLED !== 'false'
      const ready = Boolean(
        env.DB &&
          env.ADMIN_TOKEN &&
          (local || env.ADMIN_TOKEN.length >= 32) &&
          (!requireTurnstile || (env.TURNSTILE_SECRET_KEY && env.TURNSTILE_SITE_KEY)),
      )
      if (url.pathname === '/api/booking-config' && request.method === 'GET')
        return json({
          enabled: ready,
          siteKey: requireTurnstile ? (env.TURNSTILE_SITE_KEY ?? null) : null,
        })
      if (!env.DB) return json({ error: 'unavailable' }, 503)
      if (!['GET', 'POST', 'PATCH'].includes(request.method))
        return json({ error: 'method' }, 405)
      if (
        request.method !== 'GET' &&
        request.headers.get('Origin') !== url.origin
      )
        return json({ error: 'origin' }, 403)
      if (url.pathname.startsWith('/api/admin/')) {
        if (await limited(env, request, 'admin', 120))
          return json({ error: 'rate_limit' }, 429)
        const token =
          request.headers.get('Authorization')?.replace(/^Bearer /, '') ?? ''
        if (
          !env.ADMIN_TOKEN ||
          (!local && env.ADMIN_TOKEN.length < 32) ||
          !(await equalSecret(token, env.ADMIN_TOKEN))
        )
          return json({ error: 'unauthorized' }, 401)
        if (
          url.pathname === '/api/admin/reservations' &&
          request.method === 'GET'
        ) {
          const month = url.searchParams.get('month') ?? ''
          if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month))
            return json({ error: 'month' }, 400)
          const rows = await env.DB.prepare(
            'SELECT id,date,time,guests,name,email,phone,notes,locale,status,version FROM reservations WHERE date >= ? AND date < ? ORDER BY date,time,created_at LIMIT 2001',
          )
            .bind(`${month}-01`, `${month}-32`)
            .all()
          return json({
            reservations: rows.results.slice(0, 2000),
            truncated: rows.results.length > 2000,
          })
        }
        const match = url.pathname.match(
          /^\/api\/admin\/reservations\/([0-9a-f-]{36})$/,
        )
        if (match && request.method === 'PATCH') {
          const body = await readBody(request)
          if (
            !['confirmed', 'declined', 'cancelled', 'pending'].includes(
              String(body.status),
            ) ||
            !Number.isInteger(body.version)
          )
            return json({ error: 'validation' }, 400)
          const result = await env.DB.prepare(
            "UPDATE reservations SET status=?,version=version+1,updated_at=strftime('%Y-%m-%dT%H:%M:%SZ','now') WHERE id=? AND version=?",
          )
            .bind(body.status, match[1], body.version)
            .run()
          return result.meta.changes
            ? json({ ok: true })
            : json({ error: 'conflict' }, 409)
        }
        return json({ error: 'not_found' }, 404)
      }
      if (url.pathname !== '/api/reservations' || request.method !== 'POST')
        return json({ error: 'not_found' }, 404)
      if (!ready) return json({ error: 'unavailable' }, 503)
      if (await limited(env, request, 'booking', 12))
        return json({ error: 'rate_limit' }, 429)
      const body = await readBody(request)
      const str = (key: string) =>
        typeof body[key] === 'string' ? (body[key] as string).trim() : ''
      const data = {
        date: str('date'),
        time: str('time'),
        guests: Number(body.guests),
        name: str('name'),
        email: str('email').toLowerCase(),
        phone: str('phone'),
        notes: str('notes'),
        locale: str('locale'),
      }
      const key = request.headers.get('Idempotency-Key') ?? ''
      if (
        !/^[0-9a-f-]{36}$/.test(key) ||
        str('website') ||
        data.name.length < 2 ||
        data.name.length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
        data.email.length > 254 ||
        data.phone.length > 40 ||
        data.notes.length > 1000 ||
        !Number.isInteger(data.guests) ||
        data.guests < 1 ||
        data.guests > 7 ||
        !['pl', 'en'].includes(data.locale) ||
        !validDate(data.date) ||
        !bookingTimes(data.date).includes(data.time)
      )
        return json({ error: 'validation' }, 400)
      const payloadHash = await digest(JSON.stringify(data))
      // A replay may follow a lost response and a now-consumed Turnstile token.
      const existing = await env.DB.prepare(
        'SELECT id,payload_hash FROM reservations WHERE request_key=?',
      )
        .bind(key)
        .first<{ id: string; payload_hash: string }>()
      if (existing)
        return existing.payload_hash === payloadHash
          ? json({ id: existing.id, status: 'pending' })
          : json({ error: 'conflict' }, 409)
      if (requireTurnstile) {
        const token = str('turnstileToken')
        if (!token || token.length > 2048)
          return json({ error: 'challenge' }, 400)
        const verify = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            body: new URLSearchParams({
              secret: env.TURNSTILE_SECRET_KEY!,
              response: token,
              remoteip: request.headers.get('CF-Connecting-IP') ?? '',
            }),
          },
        )
        const result = (await verify.json()) as {
          success: boolean
          hostname: string
          action: string
        }
        if (
          !result.success ||
          result.hostname !== url.hostname ||
          result.action !== 'reservation'
        )
          return json({ error: 'challenge' }, 400)
      }
      const id = crypto.randomUUID()
      await env.DB.prepare(
        'INSERT INTO reservations(id,request_key,payload_hash,date,time,guests,name,email,phone,notes,locale) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(request_key) DO NOTHING',
      )
        .bind(
          id,
          key,
          payloadHash,
          data.date,
          data.time,
          data.guests,
          data.name,
          data.email,
          data.phone,
          data.notes,
          data.locale,
        )
        .run()
      const saved = await env.DB.prepare(
        'SELECT id,payload_hash FROM reservations WHERE request_key=?',
      )
        .bind(key)
        .first<{ id: string; payload_hash: string }>()
      if (saved?.payload_hash !== payloadHash)
        return json({ error: 'conflict' }, 409)
      return json({ id: saved.id, status: 'pending' }, 201)
    } catch (error) {
      if (
        error instanceof SyntaxError ||
        (error instanceof Error &&
          ['content-type', 'body', 'size'].includes(error.message))
      )
        return json({ error: 'validation' }, 400)
      // Never log guest data or credentials.
      console.error('Reservation service failed')
      return json({ error: 'unavailable' }, 503)
    }
  },
  async scheduled(_event: unknown, env: Env) {
    if (!env.DB) return
    await env.DB.prepare(
      "DELETE FROM reservations WHERE date < date('now','-90 days')",
    ).run()
    await env.DB.prepare('DELETE FROM request_limits WHERE expires < ?')
      .bind(Math.floor(Date.now() / 1000))
      .run()
  },
}
