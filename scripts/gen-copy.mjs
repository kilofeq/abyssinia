/**
 * Regenerates src/content/copy.ts prose via OpenRouter.
 *
 * The model is given ONLY verified facts and is told, hard, that it may not add
 * any others. Output is validated against the Copy shape before anything is
 * written, and the result still needs a human read — see scripts/README note.
 *
 *   OPENROUTER_API_KEY=... node scripts/gen-copy.mjs [--model google/gemini-3.8-flash]
 */
import { writeFile } from 'node:fs/promises'

const KEY = process.env.OPENROUTER_API_KEY
if (!KEY) {
  console.error('Missing OPENROUTER_API_KEY in the environment.')
  process.exit(1)
}

const modelArg = process.argv.indexOf('--model')
const MODEL = modelArg > -1 ? process.argv[modelArg + 1] : 'google/gemini-3.8-flash'

const FACTS = `
VERIFIED FACTS (the only facts that exist; you may not add any others):
- Name: Abyssinia Ethiopian Restaurant & Bar. Amharic name: አቢሲኒያ የኢትዮጵያ ምግብ ቤት
- Ethiopian restaurant and bar at Stefana Batorego 1, 31-135 Kraków, Poland.
- Phone +48 512 540 600. Email info@abyssiniarestobar.pl.
- Hours: Monday closed; Tue/Wed/Thu 13:00-22:00; Fri/Sat 13:00-23:00; Sun 13:00-22:00.
- Parties of 8 or more are asked to phone instead of using the form.
- No online booking provider is connected. The form composes an e-mail in the
  visitor's own mail client. Submitting is a REQUEST, never a confirmed booking.
- Food is served on injera (a soft, slightly sour flatbread) and shared from one
  platter. Injera is both the plate and the cutlery.
- "Wot" are slow-cooked stews built on onion and spice blends; some hot with
  berbere, some mild with turmeric.
- The restaurant's own printed menu gives three steps for eating: (1) with your
  right hand tear off a piece of injera, (2) use it to pick up food, (3) put the
  parcel in your mouth.
- The menu has 16 vegan dishes in their own section, plus meat dishes, sharing
  platters (including one served in a mesob, a traditional woven basket) and
  drinks including Ethiopian coffee and tej (honey wine).
- Prices are in Polish złoty, transcribed from the restaurant's current menu.
`

const RULES = `
ABSOLUTE RULES — breaking any one of these makes the output unusable:
1. Invent NOTHING. No reviews, ratings, awards, rankings, "best in Kraków",
   founder or family stories, years in business, chef names, ingredient
   provenance, popularity claims, atmosphere claims you cannot derive from the
   facts above, or anything about the owners.
2. No superlatives the facts do not support. No "authentic" as a marketing
   adjective, no "hidden gem", no "journey", no "experience" as a noun.
3. Never imply a booking is confirmed. The reservation copy must make clear the
   form sends a request and the restaurant confirms by phone or e-mail.
4. Polish must be idiomatic Polish written by a person, not translated English.
   English must be idiomatic English, not translated Polish. They should say the
   same thing, not be word-for-word equivalents.
5. Keep {n} placeholders exactly where the template has them.
6. Respect the length of each existing string roughly — this is a layout that is
   already built. Headings stay short. Do not return markdown or quotes around
   values.

VOICE: warm, plain, concrete, a little dry. A well-made restaurant card, not an
ad. Short sentences. Prefer a specific noun over an adjective. It should sound
like the restaurant talking, not like a brand deck.
`

/** The prose fields only — structural strings (nav labels, days) stay as they are. */
const SHAPE = {
  hero: { kicker: '', lead: '', ctaPrimary: '', ctaSecondary: '' },
  table: {
    eyebrow: '', title: '', body: ['', ''], stepsTitle: '',
    steps: ['', '', ''], stepsSource: '', asideTitle: '', aside: '',
  },
  menu: {
    eyebrow: '', title: '', lead: '', veganLine: '(must contain {n})',
    priceNote: '', allergens: '', jump: '',
  },
  visit: {
    eyebrow: '', title: '', addressTitle: '', hoursTitle: '', contactTitle: '',
    followTitle: '', directions: '',
  },
  reserve: {
    eyebrow: '', title: '', lead: '', callTitle: '', callBody: '',
    groupNote: '(must contain {n})', formTitle: '', formLead: '', submit: '',
    disclaimer: '', noscript: '', notesPlaceholder: '',
  },
  footer: { tagline: '', quickTitle: '', contactTitle: '', hoursTitle: '' },
  meta: { title: '(max 60 chars)', description: '(max 155 chars)' },
}

const prompt = `You are writing the copy for a one-page website for a real restaurant.

${FACTS}
${RULES}

Return ONE JSON object, no prose around it, shaped exactly like this, with a
"pl" key and an "en" key, each containing every field below:

${JSON.stringify(SHAPE, null, 2)}

Notes on specific fields:
- hero.kicker: one line saying what and where this is.
- hero.lead: 2-3 sentences. The strongest paragraph on the page.
- table.title: a short, concrete heading about eating from one shared platter.
- table.body: two paragraphs — the shared platter and injera; then what wot is.
- table.steps: the three steps, reworded cleanly but not changed in meaning.
- table.aside / asideTitle: advice for a first-time visitor, based only on the
  fact that sharing platters bring several dishes at once.
- menu.veganLine: mentions that {n} dishes are vegan and that they are their own
  section rather than an afterthought.
- reserve.disclaimer: states plainly that this is not yet a confirmed booking.
- meta.title / meta.description: for search results, must include Kraków.`

const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${KEY}`,
    'Content-Type': 'application/json',
    'X-Title': 'Abyssinia site copy',
  },
  body: JSON.stringify({
    model: MODEL,
    temperature: 0.8,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  }),
})

if (!res.ok) {
  console.error(`OpenRouter ${res.status}: ${await res.text()}`)
  process.exit(1)
}

const payload = await res.json()
const raw = payload.choices?.[0]?.message?.content ?? ''
const json = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')

let parsed
try {
  parsed = JSON.parse(json)
} catch {
  console.error('Model did not return valid JSON. Raw response:\n', raw.slice(0, 2000))
  process.exit(1)
}

// Validate both locales carry every field the template expects.
const problems = []
const walk = (shape, got, path) => {
  for (const [k, v] of Object.entries(shape)) {
    const here = `${path}.${k}`
    if (got?.[k] === undefined) { problems.push(`missing ${here}`); continue }
    if (Array.isArray(v)) {
      if (!Array.isArray(got[k]) || got[k].length !== v.length) {
        problems.push(`${here} should be an array of ${v.length}`)
      }
    } else if (typeof v === 'object') {
      walk(v, got[k], here)
    }
  }
}
for (const loc of ['pl', 'en']) {
  if (!parsed[loc]) { problems.push(`missing "${loc}"`); continue }
  walk(SHAPE, parsed[loc], loc)
}
for (const loc of ['pl', 'en']) {
  if (parsed[loc]?.menu?.veganLine && !parsed[loc].menu.veganLine.includes('{n}')) {
    problems.push(`${loc}.menu.veganLine lost its {n} placeholder`)
  }
  if (parsed[loc]?.reserve?.groupNote && !parsed[loc].reserve.groupNote.includes('{n}')) {
    problems.push(`${loc}.reserve.groupNote lost its {n} placeholder`)
  }
}

if (problems.length) {
  console.error('Validation failed:')
  for (const p of problems) console.error('  -', p)
  process.exit(1)
}

await writeFile('scripts/copy.generated.json', JSON.stringify(parsed, null, 2) + '\n')
console.log(`Wrote scripts/copy.generated.json (model: ${payload.model ?? MODEL})`)
console.log('Review it against the fact list before merging into src/content/copy.ts.')
