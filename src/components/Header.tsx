import type { Copy } from '../content/copy'
import { site } from '../content/site'
import { Logo } from './Logo'

/**
 * Sticky header. No JavaScript: the section links are plain anchors and the
 * language switch is a plain link to the other locale's page, so navigation
 * works before — and without — any script runs.
 */
export function Header({ copy }: { copy: Copy }) {
  const links = [
    { href: '#table', label: copy.nav.table },
    { href: '#room', label: copy.nav.room },
    { href: '#menu', label: copy.nav.menu },
    { href: '#visit', label: copy.nav.visit },
    { href: '#reserve', label: copy.nav.reserve },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/92 backdrop-blur-sm">
      <div className="u-shell flex h-14 items-center justify-between gap-4 sm:h-16">
        <a
          href={copy.path}
          className="group flex shrink-0 items-center gap-2 text-ink no-underline"
        >
          <Logo className="h-8 w-auto text-cocoa" />
          <span className="font-display text-[1.15rem] tracking-tight">
            {site.name}
          </span>
        </a>

        <nav
          aria-label={copy.nav.label}
          className="hidden flex-1 justify-center md:flex"
        >
          <ul className="flex items-center gap-7 text-[0.9rem]">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-muted no-underline transition-colors hover:text-clay"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <a
            href={copy.alt.path}
            hrefLang={copy.alt.locale}
            lang={copy.alt.locale}
            aria-label={copy.alt.label}
            title={copy.alt.label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-2xl no-underline transition-colors hover:bg-line/40"
          >
            <span aria-hidden="true">{copy.alt.locale === 'en' ? '🇬🇧' : '🇵🇱'}</span>
          </a>
          <a
            href="#reserve"
            className="rounded-full bg-clay px-4 py-2 text-[0.82rem] font-semibold text-oncream no-underline transition-colors hover:bg-ink"
          >
            {copy.nav.reserve}
          </a>
        </div>
      </div>

      {/* Small screens: the section links get their own scrollable rail rather
          than hiding behind a menu button that would need script to open. */}
      <nav aria-label={copy.nav.label} className="border-t border-line/60 md:hidden">
        <ul className="u-shell flex items-center gap-6 overflow-x-auto py-2.5 text-[0.85rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {links.map((l) => (
            <li key={l.href} className="shrink-0">
              <a href={l.href} className="text-muted no-underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
