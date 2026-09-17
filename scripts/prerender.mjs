/**
 * Renders every locale to static HTML after the client build, so the page ships
 * as finished markup rather than an empty root the browser has to fill in.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const template = await readFile(join(dist, 'index.html'), 'utf8')
const { render, routes, origin } = await import(
  pathToFileURL(join(root, 'dist-ssr', 'entry-server.js')).href
)

const escapeAttr = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const written = []

for (const locale of routes) {
  const page = render(locale)
  const html = template
    .replace('<html lang="pl">', `<html lang="${page.lang}">`)
    .replace('<!--app-title-->', () => escapeAttr(page.title))
    .replace('<!--app-description-->', () => escapeAttr(page.description))
    .replace('<!--app-head-->', () => page.head)
    .replace('<!--app-html-->', () => page.html)

  const out = join(dist, page.outFile)
  await mkdir(dirname(out), { recursive: true })
  await writeFile(out, html, 'utf8')
  written.push({ file: page.outFile, bytes: Buffer.byteLength(html) })
}

// Sitemap, from the same route list — it cannot list a page that does not exist.
const paths = routes.map((locale) => (locale === 'pl' ? '/' : `/${locale}/`))
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths
  .map(
    (path) => `  <url>
    <loc>${origin}${path}</loc>
${paths
  .map(
    (alt, i) =>
      `    <xhtml:link rel="alternate" hreflang="${routes[i]}" href="${origin}${alt}"/>`,
  )
  .join('\n')}
  </url>`,
  )
  .join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap, 'utf8')

for (const page of written) {
  console.log(`  prerendered  ${page.file.padEnd(16)} ${(page.bytes / 1024).toFixed(1)} kB`)
}
console.log(`  prerendered  sitemap.xml`)
