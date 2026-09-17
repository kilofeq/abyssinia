# Abyssinia — restaurant website

Polish (`/`) and English (`/en/`) website for Abyssinia Ethiopian Restaurant & Bar,
Stefana Batorego 1, Kraków. React + TypeScript + Vite + Tailwind CSS.
React renders static HTML at build time; only a small enhancement script runs in the browser.

## Development and validation

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
npm run check:seo
npm run preview
```

`dev` renders directly from source with the same renderer used by the production build.
Component/content changes reload the page; styles use Vite HMR. No prior build is needed.
`preview` serves the production `dist/` on port 4173 and exercises the legacy redirects
and real HTML 404 responses. `check:seo` builds both languages and validates generated
metadata, schema preservation, image files, alt text, anchors, sitemap and redirect rules.

## Production hosting

Upload **only `dist/`**, including its dotfiles. Do not publish the repository root,
`reference/`, `scripts/`, or `dist-ssr/`. This is a static website, not an SPA:
**do not configure a wildcard rewrite to `index.html`**.

The canonical origin is `https://abyssiniarestobar.pl`. It is defined in
`src/content/site.ts`; `public/robots.txt` and the Apache origin rules must also
be updated if the production domain changes.

- **Cloudflare Pages / Netlify:** `_redirects` contains the old-path redirects;
  `404.html` provides the not-found page. Set the apex domain as primary and configure
  HTTPS and www-to-apex redirects in the host's domain/edge settings.
- **Apache 2.4:** `.htaccess` supplies 301 redirects, canonical HTTPS/apex rules,
  index aliases and `ErrorDocument 404`. Requires `mod_rewrite` and
  `AllowOverride FileInfo`. Its HTTPS rule assumes TLS terminates at Apache;
  behind a reverse proxy, configure canonical HTTPS at the trusted edge instead
  to avoid a redirect loop.
- **Other hosts:** translate `_redirects` into the host's native permanent redirects,
  serve `404.html` with status 404, and configure HTTPS/apex normalization.
  These files are not interpreted by every static host (including GitHub Pages).

| Previous URL (also with trailing slash) | Permanent target |
| --- | --- |
| `/menu` | `/#menu` |
| `/gallery` | `/#room` |
| `/contact` | `/#visit` |
| `/reservation` | `/#reserve` |
| `/about` | `/#table` |

`/en` redirects to `/en/`; explicit index.html URLs redirect to directory URLs.
The old public site was English; visitors landing in Polish can use the visible
English link, which remains available throughout the page.

## SEO

Both languages ship complete HTML, translated titles/descriptions, canonical URLs,
reciprocal hreflang links, and a sitemap. Restaurant JSON-LD derives its address,
hours and contact data from the same constants as the visible page. It includes
representative images, a logo and a boolean reservation indicator. The site does not
invent ratings, reviews or geographic coordinates. Social metadata uses `website`
and an existing landscape photograph of the restaurant for its preview image.

The prerender regression check ensures JSON-LD is preserved exactly: JavaScript's
string replacement syntax must not turn the source `$$` price range into `$`.
Menu photographs have localized visual descriptions; decorative instruction images
keep empty alt text because their meaning is in the adjacent instructions.

### Deployment checks requiring production access

After deployment, verify HTTPS/www redirects, `/en/`, old-path 301s, unknown-page
404s, `/robots.txt` and `/sitemap.xml` on the actual domain. Validate the deployed
URL in Google's Rich Results Test. Submit the sitemap and inspect both language
URLs in Search Console. Check address, phone, hours, website/menu links against
the restaurant's Google Business Profile. Git push alone does not perform these steps.

Fresh local Lighthouse results are recorded in `docs/seo-validation.md`.
Historical 100/100 scores from earlier designs are not current performance claims.

## Content and assets

- `src/content/site.ts`: business details and hours.
- `src/content/menu.ts`: dishes and prices transcribed from the restaurant's menu.
- `src/content/copy.ts`: Polish and English text.
- `src/content/food-alt.ts`: visual descriptions for menu photos.
- `reference/menu.pdf`: source linked by the restaurant at
  `https://drive.google.com/file/d/1alVzvdYvoZaBH3ZuwEQlnbeYqX8l-xwj/view`.
- `reference/menu-images/`: extracted source images.
- `scripts/build-menu-images.mjs`: regenerates 37 AVIF/WebP image pairs and dimensions.
- `scripts/build-images.mjs`: regenerates responsive interior photography.
- `scripts/build-fonts.sh`: regenerates self-hosted font subsets (needs fonttools/brotli).

The menu uses 34 photographs and three illustrations explain eating with injera.
The opening photograph is preloaded as AVIF; WebP remains available as a fallback.
Other images load lazily with fixed dimensions.
The palette is cream, brick red, gold and green. Menu photos enlarge 2× on click,
close on a second click, outside click or Escape, and work with a keyboard.

## Reservations

Phone and email are the current booking channels. The form composes an email in
the visitor's mail client; it does not send it or confirm availability. A future
booking provider can be configured with `RESERVATION_PROVIDER_URL`.

## Facts to confirm with the restaurant

- The printed meat platter count differs between Polish and English; the website
  intentionally uses a general description until clarified.
- Some wine alcohol percentages in the source are ambiguous and are omitted.
- Confirm printed prices and current opening hours before launch.
