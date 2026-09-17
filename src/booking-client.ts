import { calendar } from './calendar'
import {
  addDays,
  bookingTimes,
  bookingWindowDays,
  warsawNow,
} from './booking-rules'
interface Turnstile {
  render(node: HTMLElement, options: Record<string, unknown>): string
  reset(id: string): void
}
export async function wireBooking() {
  const form = document.querySelector<HTMLFormElement>('[data-reserve]')
  if (!form) return
  const en = document.documentElement.lang === 'en'
  const t = (pl: string, eng: string) => (en ? eng : pl)
  const date = form.querySelector<HTMLInputElement>('#rs-date')!
  const time = form.querySelector<HTMLSelectElement>('#rs-time')!
  const status = form.querySelector<HTMLElement>('[data-reserve-status]')!
  const submit = form.querySelector<HTMLButtonElement>('[type=submit]')!
  const today = warsawNow().date
  date.min = today
  date.max = addDays(today, bookingWindowDays)
  let initial = today
  while (!bookingTimes(initial).length) initial = addDays(initial, 1)
  date.value = initial
  let token = ''
  let widget: string | undefined
  let turnstile: Turnstile | undefined
  let requestKey = crypto.randomUUID()
  let lastPayload = ''
  let sending = false
  let available = false
  let completed = false
  const visit = document.createElement('p')
  visit.className = 'booking-visit'
  visit.setAttribute('aria-live', 'polite')
  form.querySelector('.booking-details')!.prepend(visit)
  const guests = form.querySelector<HTMLSelectElement>('#rs-guests')!
  const updateVisit = () => {
    visit.textContent = `${date.value ? new Intl.DateTimeFormat(en ? 'en' : 'pl', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${date.value}T12:00:00Z`)) : ''} · ${time.value || '—'} · ${guests.value} ${t('os.', 'guests')}`
  }
  guests.addEventListener('change', updateVisit)
  const times = form.querySelector<HTMLElement>('[data-booking-times]')!
  function updateTimes() {
    const previous = time.value
    const slots = bookingTimes(date.value)
    time.replaceChildren()
    times.replaceChildren()
    for (const slot of slots) {
      const option = document.createElement('option')
      option.value = slot
      option.textContent = slot
      time.append(option)
    }
    if (slots.includes(previous)) time.value = previous
    for (const slot of slots) {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = slot
      b.dataset.time = slot
      b.setAttribute('aria-pressed', String(time.value === slot))
      b.onclick = () => {
        time.value = slot
        updateTimes()
        times.querySelector<HTMLButtonElement>(`[data-time="${slot}"]`)?.focus()
      }
      times.append(b)
    }
    time.hidden = false
    time.classList.add('booking-native-time')
    date.setCustomValidity(
      slots.length
        ? ''
        : t('Wybierz inny dzień.', 'Please choose another day.'),
    )
    updateVisit()
    summary.textContent = slots.length
      ? t('Wybierz godzinę rozpoczęcia wizyty.', 'Choose your arrival time.')
      : t(
          'Brak godzin w tym dniu. Wybierz inny dzień.',
          'No times on this day. Please choose another day.',
        )
  }
  const summary = document.createElement('p')
  summary.className = 'booking-help'
  summary.setAttribute('aria-live', 'polite')
  times.after(summary)
  const cal = calendar(form.querySelector('[data-booking-calendar]')!, {
    locale: en ? 'en' : 'pl',
    selected: initial,
    min: today,
    max: date.max,
    disabled: (d) => !bookingTimes(d).length,
    onSelect: (d) => {
      date.value = d
      updateTimes()
    },
  })
  date.onchange = () => {
    if (date.value >= date.min && date.value <= date.max) cal.select(date.value)
    updateTimes()
  }
  time.addEventListener('change', updateTimes)
  updateTimes()
  const fail = t(
    'Rezerwacje online są chwilowo niedostępne. Zadzwoń: +48 512 540 600.',
    'Online reservations are temporarily unavailable. Call +48 512 540 600.',
  )
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (sending || completed || !available || !form.reportValidity()) return
    if (!bookingTimes(date.value).includes(time.value)) {
      updateTimes()
      status.textContent = t(
        'Wybierz ponownie godzinę.',
        'Please select a time again.',
      )
      return
    }
    const data = Object.fromEntries(
      [...new FormData(form)].filter(([key]) =>
        [
          'date',
          'time',
          'guests',
          'name',
          'email',
          'phone',
          'notes',
          'website',
        ].includes(key),
      ),
    )
    const payload = JSON.stringify({ ...data, locale: en ? 'en' : 'pl' })
    if (payload !== lastPayload) {
      requestKey = crypto.randomUUID()
      lastPayload = payload
    }
    sending = true
    submit.disabled = true
    status.textContent = t('Wysyłamy zgłoszenie…', 'Sending your request…')
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        signal: AbortSignal.timeout(15000),
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': requestKey,
        },
        body: JSON.stringify({ ...JSON.parse(payload), turnstileToken: token }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'unavailable')
      status.textContent = t(
        'Dziękujemy! Zgłoszenie zapisane. Stolik będzie zarezerwowany po kontakcie i potwierdzeniu przez obsługę.',
        'Thank you! Your request is saved. Your table is reserved only after our team contacts you to confirm.',
      )
      const done = document.createElement('div')
      done.className = 'booking-success'
      const title = document.createElement('h3')
      title.textContent = t('Zgłoszenie zapisane', 'Request saved')
      const detail = document.createElement('p')
      detail.textContent = `${data.date} · ${data.time} · ${data.guests} ${t('os.', 'guests')}`
      done.append(title, detail)
      form.prepend(done)
      done.tabIndex = -1
      done.focus()
      completed = true
      submit.textContent = t('Zgłoszenie wysłane ✓', 'Request sent ✓')
    } catch (error) {
      const code = error instanceof Error ? error.message : ''
      status.textContent =
        code === 'validation'
          ? t(
              'Sprawdź dane, dzień i godzinę, a następnie spróbuj ponownie.',
              'Check your details, date and time, then try again.',
            )
          : code === 'rate_limit'
            ? t(
                'Zbyt wiele prób. Spróbuj ponownie za 10 minut lub zadzwoń.',
                'Too many attempts. Try again in 10 minutes or call us.',
              )
            : code === 'challenge'
              ? t(
                  'Potwierdź ponownie zabezpieczenie i wyślij formularz.',
                  'Complete the verification and submit again.',
                )
              : fail
      if (widget && turnstile) {
        token = ''
        turnstile.reset(widget)
      }
    } finally {
      sending = false
      submit.disabled = completed || !available || Boolean(widget && !token)
    }
  })
  try {
    const res = await fetch('/api/booking-config')
    if (!res.ok) throw new Error()
    const config = await res.json()
    if (!config.enabled) throw new Error()
    available = true
    if (config.siteKey) {
      const script = document.createElement('script')
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      await new Promise<void>((resolve, reject) => {
        script.onload = () => resolve()
        script.onerror = reject
        document.head.append(script)
      })
      turnstile = (window as unknown as { turnstile: Turnstile }).turnstile
      widget = turnstile.render(form.querySelector('[data-turnstile]')!, {
        sitekey: config.siteKey,
        action: 'reservation',
        theme: 'light',
        language: en ? 'en' : 'pl',
        callback: (value: string) => {
          token = value
          submit.disabled = sending || completed
        },
        'expired-callback': () => {
          token = ''
          submit.disabled = true
        },
        'error-callback': () => {
          token = ''
          submit.disabled = true
          status.textContent = fail
        },
      })
    } else submit.disabled = false
  } catch {
    status.textContent = fail
    submit.disabled = true
  }
}
