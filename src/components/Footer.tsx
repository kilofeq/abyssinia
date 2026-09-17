import type { Copy } from '../content/copy'
import { site } from '../content/site'
import { hourRows } from '../lib'
import { Logo } from './Logo'

export function Footer({ copy }: { copy: Copy }) {
  const rows = hourRows(copy)
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-oncream/15 bg-night text-oncream">
      <div className="u-shell grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-20">
        <div className="lg:col-span-1">
          <p className="flex items-center gap-2.5">
            <Logo className="h-9 w-auto text-onochre" />
            <span className="font-display text-[1.2rem]">{site.name}</span>
          </p>
          <p className="mt-4 max-w-[30ch] text-[0.92rem] leading-[1.6] text-ondim">
            {copy.footer.tagline}
          </p>
          <p lang="am" className="mt-4 text-[0.95rem] text-ondim">
            {site.amharic}
          </p>
        </div>

        <div>
          <h2 className="u-eyebrow text-onochre">{copy.footer.contactTitle}</h2>
          <address className="mt-4 space-y-2 text-[0.95rem] leading-[1.6] not-italic text-ondim">
            <span className="block">
              {site.street}
              <br />
              {site.postalCode} {site.city}
            </span>
            <a
              href={`tel:${site.phoneHref}`}
              className="block text-oncream no-underline underline-offset-4 hover:underline"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="block text-oncream no-underline underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
          </address>
        </div>

        <div>
          <h2 className="u-eyebrow text-onochre">{copy.footer.hoursTitle}</h2>
          <ul className="mt-4 space-y-1.5 text-[0.9rem] text-ondim">
            {rows.map((row) => (
              <li key={row.day} className="flex justify-between gap-4 tabular-nums">
                <span>{copy.daysShort[row.day - 1]}</span>
                <span className={row.closed ? 'text-ondim/70' : 'text-oncream'}>
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="u-eyebrow text-onochre">{copy.footer.quickTitle}</h2>
          <ul className="mt-4 space-y-2 text-[0.95rem]">
            {[
              { href: '#table', label: copy.nav.table },
              { href: '#room', label: copy.nav.room },
              { href: '#menu', label: copy.nav.menu },
              { href: '#visit', label: copy.nav.visit },
              { href: '#reserve', label: copy.nav.reserve },
            ].map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-ondim no-underline underline-offset-4 hover:text-oncream hover:underline"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <h2 className="u-eyebrow mt-8 text-onochre">{copy.visit.followTitle}</h2>
          <ul className="mt-4 flex gap-4 text-[0.95rem]">
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-ondim no-underline underline-offset-4 hover:text-oncream hover:underline"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-ondim no-underline underline-offset-4 hover:text-oncream hover:underline"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="u-shell flex flex-wrap items-center justify-between gap-3 border-t border-oncream/15 py-6 text-[0.82rem] text-ondim">
        <p>
          © {year} {site.legalName}. {copy.footer.rights}
        </p>
        <p>
          <a
            href={copy.alt.path}
            hrefLang={copy.alt.locale}
            lang={copy.alt.locale}
            className="text-ondim no-underline underline-offset-4 hover:text-oncream hover:underline"
          >
            {copy.alt.label}
          </a>
        </p>
      </div>
    </footer>
  )
}
