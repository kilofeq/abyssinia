import type { Copy } from '../content/copy'
import { site, RESERVATION_PROVIDER_URL } from '../content/site'
import { Mesob } from './Mesob'

const fieldClass =
  'mt-1.5 w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-[0.98rem] text-ink placeholder:text-muted'
const labelClass = 'block text-[0.85rem] font-semibold text-ink'

export function Reserve({ copy }: { copy: Copy }) {
  const r = copy.reserve

  return (
    <section
      id="reserve"
      className="relative scroll-mt-28 overflow-hidden bg-night py-16 text-oncream sm:py-24 lg:py-28"
      aria-labelledby="reserve-title"
    >
      <div
        className="pointer-events-none absolute -bottom-[46%] -left-[30%] w-[110%] max-w-[46rem] text-onochre/12 lg:-bottom-[58%] lg:-left-[10%] lg:w-[52%]"
        aria-hidden="true"
      >
        <Mesob className="h-auto w-full" count={10} />
      </div>

      <div className="u-shell relative">
        <div className="reserve-intro">
          <p className="u-eyebrow text-onochre">{r.eyebrow}</p>
          <h2 id="reserve-title" className="mt-5 text-(length:--text-title)">
            {r.title}
          </h2>
          <p className="mt-6 max-w-[40ch] text-(length:--text-lead) leading-[1.6] text-ondim">
            {r.lead}
          </p>

          <div className="mt-10 border-t border-oncream/20 pt-8">
            <h3 className="u-eyebrow text-ondim">{r.callTitle}</h3>
            <a
              href={`tel:${site.phoneHref}`}
              className="mt-3 block text-[clamp(1.65rem,1.05rem+2.3vw,2.4rem)] font-semibold tracking-tight text-oncream tabular-nums no-underline transition-colors hover:text-onochre"
            >
              {site.phone}
            </a>
            <p className="mt-5 max-w-[38ch] rounded-md border border-onochre/30 px-4 py-3 text-[0.9rem] leading-[1.5] text-ondim">
              {r.groupNote.replace('{n}', String(site.groupThreshold))}
            </p>
          </div>
        </div>

        <div className="mt-10">
          {RESERVATION_PROVIDER_URL ? (
            <a
              href={RESERVATION_PROVIDER_URL}
              className="inline-block rounded-full bg-oncream px-7 py-4 font-semibold text-night no-underline"
            >
              {r.providerCta}
            </a>
          ) : (
            <div className="booking-card bg-canvas text-ink">
              <h3 className="font-display text-(length:--text-head)">
                {r.formTitle}
              </h3>

              <noscript>
                <p className="mt-5 rounded-md border border-clay/40 bg-surface px-4 py-3 text-[0.9rem] leading-[1.5] text-ink">
                  {r.noscript}
                </p>
              </noscript>

              <form
                data-reserve
                action="/api/reservations"
                method="post"
                className="booking-form mt-7"
              >
                <div className="booking-schedule">
                  <div className="sm:col-span-2 booking-calendar-wrap">
                    <div data-booking-calendar aria-label={r.date} />
                    <label className={labelClass} htmlFor="rs-date">
                      {r.date}
                    </label>
                    <input
                      className={fieldClass}
                      id="rs-date"
                      name="date"
                      type="date"
                      required
                    />
                    <p className="booking-help">
                      {copy.locale === 'pl'
                        ? 'Godziny według czasu w Krakowie. W poniedziałki odpoczywamy.'
                        : 'All times are local to Kraków. Closed on Mondays.'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="rs-time">
                      {r.time}
                    </label>
                    <select
                      className={fieldClass}
                      id="rs-time"
                      name="time"
                      required
                    >
                      <option value="">
                        {copy.locale === 'pl'
                          ? 'Wybierz godzinę'
                          : 'Choose a time'}
                      </option>
                    </select>
                    <div data-booking-times className="booking-times" />
                  </div>
                </div>
                <div className="booking-details">
                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="rs-name">
                      {r.name}
                    </label>
                    <input
                      className={fieldClass}
                      id="rs-name"
                      name="name"
                      type="text"
                      maxLength={100}
                      autoComplete="name"
                      required
                      placeholder={r.namePlaceholder}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="rs-email">
                      {r.email}
                    </label>
                    <input
                      className={fieldClass}
                      id="rs-email"
                      name="email"
                      type="email"
                      maxLength={254}
                      autoComplete="email"
                      required
                      placeholder="jan@example.com"
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="rs-phone">
                      {r.phone}{' '}
                      <span className="font-normal text-muted">
                        ({r.phoneOptional})
                      </span>
                    </label>
                    <input
                      className={fieldClass}
                      id="rs-phone"
                      name="phone"
                      type="tel"
                      maxLength={40}
                      autoComplete="tel"
                      placeholder={site.phone}
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="rs-guests">
                      {r.guests}
                    </label>
                    <select
                      className={fieldClass}
                      id="rs-guests"
                      name="guests"
                      defaultValue="2"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass} htmlFor="rs-notes">
                      {r.notes}
                    </label>
                    <textarea
                      className={fieldClass}
                      id="rs-notes"
                      name="notes"
                      maxLength={1000}
                      rows={2}
                      placeholder={r.notesPlaceholder}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div data-turnstile />
                    <label className="booking-trap" aria-hidden="true">
                      Website
                      <input name="website" tabIndex={-1} autoComplete="off" />
                    </label>
                    <button
                      disabled
                      type="submit"
                      className="w-full rounded-full bg-clay px-6 py-3.5 font-semibold text-oncream transition-colors hover:bg-ink sm:w-auto"
                      aria-describedby="rs-disclaimer"
                    >
                      {r.submit}
                    </button>
                    <p
                      id="rs-disclaimer"
                      className="mt-4 text-[0.85rem] leading-[1.5] text-muted"
                    >
                      {r.disclaimer}{' '}
                      {copy.locale === 'pl'
                        ? 'Dane wykorzystamy do obsługi rezerwacji i usuniemy do 90 dni po wizycie. Kontakt w sprawie danych:'
                        : 'We use your details to handle your booking and delete them within 90 days after your visit. Data enquiries:'}{' '}
                      <a href={`mailto:${site.email}`}>{site.email}</a>
                    </p>
                    <p
                      data-reserve-status
                      role="status"
                      aria-live="polite"
                      className="mt-2 text-[0.85rem] leading-[1.5] font-semibold text-moss empty:mt-0"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
