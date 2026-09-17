import type { Copy } from '../content/copy'
import { site } from '../content/site'
import { hourRows } from '../lib'
import { MesobMark } from './Mesob'

export function Visit({ copy }: { copy: Copy }) {
  const rows = hourRows(copy)

  return (
    <section id="visit" className="u-shell scroll-mt-28 py-16 sm:py-24 lg:py-32">
      <p className="u-eyebrow flex items-center gap-2.5 text-clay">
        <MesobMark className="h-4 w-4" />
        {copy.visit.eyebrow}
      </p>
      <h2 className="mt-5 text-(length:--text-title)">{copy.visit.title}</h2>

      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14">
        <div>
          <h3 className="u-eyebrow text-muted">{copy.visit.addressTitle}</h3>
          <address className="mt-4 text-[1.05rem] leading-[1.6] not-italic">
            {site.legalName}
            <br />
            {site.street}
            <br />
            {site.postalCode} {site.city}
          </address>
          <a
            href={site.maps}
            className="mt-5 inline-flex items-center gap-1.5 border-b border-clay/40 pb-0.5 text-[0.95rem] font-semibold text-clay no-underline transition-colors hover:border-clay"
            target="_blank"
            rel="noreferrer"
          >
            {copy.visit.directions}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div>
          <h3 className="u-eyebrow text-muted">{copy.visit.hoursTitle}</h3>
          <table className="mt-4 w-full max-w-[22rem] text-[0.98rem]">
            <caption className="sr-only">{copy.visit.hoursTitle}</caption>
            <tbody data-hours>
              {rows.map((row) => (
                <tr
                  key={row.day}
                  data-day={row.day}
                  className="border-b border-linesoft last:border-b-0"
                >
                  <th
                    scope="row"
                    className="py-2 pr-4 text-left font-normal text-muted data-[today]:font-semibold data-[today]:text-ink"
                  >
                    {row.label}
                  </th>
                  <td
                    className={`py-2 text-right tabular-nums ${
                      row.closed ? 'text-muted' : 'text-ink'
                    }`}
                  >
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="u-eyebrow text-muted">{copy.visit.contactTitle}</h3>
          <ul className="mt-4 space-y-3 text-[1.05rem]">
            <li>
              <a
                href={`tel:${site.phoneHref}`}
                className="font-semibold tabular-nums text-ink no-underline underline-offset-4 hover:underline"
              >
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-ink no-underline underline-offset-4 hover:underline"
              >
                {site.email}
              </a>
            </li>
          </ul>

          <h3 className="u-eyebrow mt-8 text-muted">{copy.visit.followTitle}</h3>
          <ul className="mt-4 flex gap-5 text-[0.98rem]">
            <li>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-ink no-underline underline-offset-4 hover:underline"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-ink no-underline underline-offset-4 hover:underline"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
