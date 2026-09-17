import { renderToStaticMarkup } from 'react-dom/server'
import { App } from './App'
import { locales, type Locale } from './content/copy'
import { metaDescription, structuredData } from './lib'
import { site } from './content/site'

export type RenderResult = {
  html: string
  lang: Locale
  title: string
  description: string
  head: string
  outFile: string
}

export function render(locale: Locale): RenderResult {
  const copy = locales[locale]
  const canonical = `${site.origin}${copy.path}`
  const description = metaDescription(copy)
  const jsonLd = JSON.stringify(structuredData(copy)).replace(/</g, '\\u003c')

  const head = [
    '<link rel="preload" as="image" type="image/avif" href="/food/vegan-combo.avif" fetchpriority="high">',
    `<link rel="canonical" href="${canonical}">`,
    `<link rel="alternate" hreflang="pl" href="${site.origin}/">`,
    `<link rel="alternate" hreflang="en" href="${site.origin}/en/">`,
    `<link rel="alternate" hreflang="x-default" href="${site.origin}/">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${site.legalName}">`,
    `<meta property="og:locale" content="${locale === 'pl' ? 'pl_PL' : 'en_GB'}">`,
    `<meta property="og:title" content="${escapeAttr(copy.meta.title)}">`,
    `<meta property="og:description" content="${escapeAttr(description)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:locale:alternate" content="${locale === 'pl' ? 'en_GB' : 'pl_PL'}">`,
    `<meta property="og:image" content="${site.origin}/gallery/hero-wide-760.webp">`,
    '<meta property="og:image:type" content="image/webp">',
    '<meta property="og:image:width" content="760">',
    '<meta property="og:image:height" content="570">',
    `<meta property="og:image:alt" content="${escapeAttr(copy.hero.photoAlt)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:image" content="${site.origin}/gallery/hero-wide-760.webp">`,
    `<meta name="twitter:image:alt" content="${escapeAttr(copy.hero.photoAlt)}">`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ')

  return {
    html: renderToStaticMarkup(<App copy={copy} />),
    lang: locale,
    title: copy.meta.title,
    description,
    head,
    outFile: locale === 'pl' ? 'index.html' : 'en/index.html',
  }
}

export const routes: Locale[] = ['pl', 'en']

export const origin = site.origin

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}
