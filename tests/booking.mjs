import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { spawn, execFileSync } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const state = await mkdtemp(join(tmpdir(), 'abyssinia-test-'))
const cli = 'node_modules/wrangler/bin/wrangler.js'
const token = 'local-integration-test-token-not-for-production'
const port = 8791
const origin = `http://127.0.0.1:${port}`
let child
try {
  execFileSync(
    process.execPath,
    [
      cli,
      'd1',
      'migrations',
      'apply',
      'DB',
      '--local',
      '--env',
      'local',
      '--persist-to',
      state,
    ],
    { stdio: 'pipe' },
  )
  child = spawn(
    process.execPath,
    [
      cli,
      'dev',
      '--env',
      'local',
      '--ip',
      '127.0.0.1',
      '--port',
      String(port),
      '--persist-to',
      state,
      '--var',
      `ADMIN_TOKEN:${token}`,
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  )
  await new Promise((resolve, reject) => {
    let output = ''
    const timeout = setTimeout(
      () => reject(new Error(`Worker startup timeout: ${output}`)),
      30000,
    )
    const read = (data) => {
      output += data
      if (output.includes('Ready on')) {
        clearTimeout(timeout)
        resolve()
      }
    }
    child.stdout.on('data', read)
    child.stderr.on('data', read)
    child.once('exit', (code) => {
      clearTimeout(timeout)
      reject(new Error(`Worker exited ${code}: ${output}`))
    })
  })
  const request = (path, method = 'GET', body, headers = {}) =>
    fetch(origin + path, {
      method,
      headers: {
        Origin: origin,
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      redirect: 'manual',
    })
  const day = new Date()
  day.setUTCDate(day.getUTCDate() + 7)
  while (day.getUTCDay() !== 2) day.setUTCDate(day.getUTCDate() + 1)
  const date = day.toISOString().slice(0, 10)
  const booking = {
    name: 'Test <img src=x onerror=alert(1)>',
    email: 'test@example.com',
    phone: '',
    notes: 'Integration test',
    guests: 2,
    date,
    time: '19:00',
    locale: 'pl',
  }
  const post = (data, key = crypto.randomUUID(), headers = {}) =>
    request('/api/reservations', 'POST', data, {
      'Idempotency-Key': key,
      ...headers,
    })
  const auth = { Authorization: `Bearer ${token}` }
  assert.equal(
    (await request('/api/booking-config').then((r) => r.json())).enabled,
    true,
  )
  assert.equal(
    (await request('/api/admin/reservations?month=' + date.slice(0, 7))).status,
    401,
  )
  assert.equal(
    (
      await post(booking, crypto.randomUUID(), {
        Origin: 'https://attacker.example',
      })
    ).status,
    403,
  )
  assert.equal((await post({ ...booking, guests: 8 })).status, 400)
  const monday = new Date(`${date}T12:00Z`)
  monday.setUTCDate(monday.getUTCDate() - 1)
  assert.equal(
    (await post({ ...booking, date: monday.toISOString().slice(0, 10) }))
      .status,
    400,
  )
  assert.equal((await post({ ...booking, time: '22:00' })).status, 400)
  assert.equal((await post({ ...booking, date: '2026-02-30' })).status, 400)
  assert.equal((await post({ ...booking, date: '2020-01-01' })).status, 400)
  assert.equal(
    (await post({ ...booking, notes: 'a'.repeat(9000) })).status,
    400,
  )
  const key = crypto.randomUUID()
  const [a, b] = await Promise.all([post(booking, key), post(booking, key)])
  assert.ok(a.ok && b.ok)
  const result = await a.json()
  assert.equal((await b.json()).id, result.id)
  assert.equal((await post({ ...booking, guests: 3 }, key)).status, 409)
  const list = await request(
    '/api/admin/reservations?month=' + date.slice(0, 7),
    'GET',
    undefined,
    auth,
  ).then((r) => r.json())
  assert.equal(list.reservations.length, 1)
  assert.equal(list.reservations[0].status, 'pending')
  assert.equal(list.reservations[0].name, booking.name)
  assert.equal(
    (
      await request(
        `/api/admin/reservations/${result.id}`,
        'PATCH',
        { status: 'confirmed', version: 1 },
        auth,
      )
    ).status,
    200,
  )
  assert.equal(
    (
      await request(
        `/api/admin/reservations/${result.id}`,
        'PATCH',
        { status: 'declined', version: 1 },
        auth,
      )
    ).status,
    409,
  )
  const updated = await request(
    '/api/admin/reservations?month=' + date.slice(0, 7),
    'GET',
    undefined,
    auth,
  ).then((r) => r.json())
  assert.equal(updated.reservations[0].status, 'confirmed')
  assert.equal(
    (
      await request(
        `/api/admin/reservations/${result.id}`,
        'PATCH',
        { status: 'cancelled', version: 2 },
        auth,
      )
    ).status,
    200,
  )
  let limited
  for (let i = 0; i < 5; i++) limited = await post(booking)
  assert.equal(limited.status, 429)
  assert.equal((await request('/not-a-page')).status, 404)
  assert.equal((await request('/admin/')).status, 200)
  assert.equal((await request('/en/')).status, 200)
  const vite = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true },
  })
  try {
    const { default: worker } = await vite.ssrLoadModule('/worker/index.ts')
    const response = await worker.fetch(
      new Request('https://restaurant.example/api/booking-config'),
      { LOCAL_DEVELOPMENT: 'true', DB: {}, ADMIN_TOKEN: token },
    )
    assert.equal(
      (await response.json()).enabled,
      false,
      'Local bypass must not work on a public hostname',
    )
    const rules = await vite.ssrLoadModule('/src/booking-rules.ts')
    assert.equal(
      rules.warsawNow(new Date('2026-03-29T01:30:00Z')).time,
      '03:30',
    )
    assert.equal(
      rules.warsawNow(new Date('2026-10-25T01:30:00Z')).time,
      '02:30',
    )
    assert.deepEqual(
      rules.bookingTimes('2026-09-21', new Date('2026-09-17T08:00:00Z')),
      [],
    )
    assert.equal(
      rules.bookingTimes('2026-09-18', new Date('2026-09-17T08:00:00Z')).at(-1),
      '22:00',
    )
  } finally {
    await vite.close()
  }
  console.log(
    'Booking integration passed: D1 persistence, validation, auth, CSRF, replay/concurrency, status conflicts, rate limits, local bypass isolation and routing.',
  )
} finally {
  if (child) {
    child.kill('SIGTERM')
    await new Promise((resolve) => {
      child.once('exit', resolve)
      setTimeout(resolve, 3000)
    })
  }
  await rm(state, { recursive: true, force: true })
}
