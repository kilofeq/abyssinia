import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { render } from '../dist-ssr/entry-server.js'
import sharp from 'sharp'

for (const [locale, path] of [['pl', 'index.html'], ['en', 'en/index.html']]) {
  const html = await readFile(`dist/${path}`, 'utf8')
  const head = render(locale).head
  const schema = (text) => JSON.parse(text.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])
  assert.deepEqual(schema(html), schema(head), 'Prerender must preserve JSON-LD exactly, including $$')
  assert.equal(schema(html).priceRange, '$$')
  assert.equal(schema(html).acceptsReservations, true)
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
  assert(!html.includes('<!--app-'))
  assert(html.includes(`<html lang="${locale}">`))
  assert(html.includes(`rel="canonical" href="https://abyssiniarestobar.pl/${locale === 'en' ? 'en/' : ''}"`))
  for (const lang of ['pl', 'en', 'x-default']) assert(html.includes(`hreflang="${lang}"`))
  assert(html.includes('property="og:type" content="website"'))
  assert(!html.includes('content="noindex'))
  const imageURL = html.match(/property="og:image" content="([^"]+)"/)[1]
  const meta = await sharp(`dist${new URL(imageURL).pathname}`).metadata()
  assert(html.includes(`property="og:image:width" content="${meta.width}"`))
  assert(html.includes(`property="og:image:height" content="${meta.height}"`))
  for (const url of [...schema(html).image, schema(html).logo]) await access(`dist${new URL(url).pathname}`)
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
  assert.equal(new Set(ids).size, ids.length)
  for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(anchor))
  for (const [, image] of html.matchAll(/<button[^>]*data-dish-zoom[^>]*>(.*?)<\/button>/gs)) {
    assert(/<img[^>]*alt="[^"]+"/.test(image), 'Menu photos need descriptive alt text')
  }
  assert.equal((html.split('<footer')[1].match(/href="#room"/g) ?? []).length, 1)
  console.log(`SEO checks passed: ${path}`)
}
const redirects = await readFile('dist/_redirects', 'utf8')
for (const route of ['menu', 'gallery', 'contact', 'reservation', 'about']) {
  assert(new RegExp(`^/${route} /#[a-z]+ 301$`, 'm').test(redirects))
}
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
assert.equal((sitemap.match(/<loc>/g) ?? []).length, 2)
assert(!/^Disallow:\s*\/\s*$/m.test(await readFile('dist/robots.txt', 'utf8')))
assert((await readFile('dist/404.html', 'utf8')).includes('noindex,follow'))
await access('dist/.htaccess')
console.log('Redirect map, sitemap, robots and 404 checks passed')
