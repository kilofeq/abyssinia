# SEO validation — 2026-09-17

Production build served locally with Vite preview. Lighthouse 12.8.2, simulated
throttling, fresh Chrome profiles. Lab measurements are not field Core Web Vitals
and will vary with the production host, device and network.

| Run | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Polish mobile / | 96 | 100 | 100 | 100 | 2.9 s | 0 | 0 ms |
| English desktop /en/ | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |

Before AVIF optimization the mobile run scored 83 for performance with LCP 4.7 s.
The main food image was reduced from about 303 kB WebP to 108 kB AVIF, while
retaining a WebP fallback and sufficient detail for the 2× menu zoom.

## Verified

- TypeScript and production build pass.
- Generated PL/EN HTML passes `node scripts/check-seo.mjs`.
- JSON-LD exactly matches the renderer, including `priceRange: "$$"`.
- Social preview image dimensions match its actual asset.
- Local HTTP checks return 200 for both languages, robots.txt and sitemap.xml.
- Legacy paths return 301 with the correct Location; unknown page and HTML paths return 404.
- CI runs the build and SEO checks on pushes to main and pull requests.

## Production follow-up

The GitHub push does not deploy or grant access to Google accounts. Confirm the
active host uses the supplied redirect rules and returns real 404s, configure
HTTPS/www normalization, then use Rich Results Test and Search Console on the
production domain. Verify business-profile details with the restaurant. No field
performance or search-index coverage claim is made from local measurements.
