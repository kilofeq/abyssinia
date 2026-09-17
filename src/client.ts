import './styles.css'

/**
 * The only script that ships. Everything here is an enhancement on top of a
 * page that already works without it: the hours table, the date field and the
 * reservation form are all usable if this file never runs.
 */

const STATUS = {
  pl: 'Otworzyliśmy wiadomość w Twoim programie pocztowym. Wyślij ją, a odezwiemy się z potwierdzeniem.',
  en: 'We opened a message in your mail app. Send it and we will come back to you with a confirmation.',
} as const

function locale(): keyof typeof STATUS {
  return document.documentElement.lang === 'en' ? 'en' : 'pl'
}

/** Highlight the current weekday in the opening-hours table. */
function markToday(): void {
  const jsDay = new Date().getDay() // 0 = Sunday
  const isoDay = jsDay === 0 ? 7 : jsDay
  document
    .querySelectorAll<HTMLElement>(`[data-hours] [data-day="${isoDay}"] th`)
    .forEach((cell) => cell.setAttribute('data-today', ''))
}

/** Stop people picking a date in the past. */
function limitDate(): void {
  const field = document.querySelector<HTMLInputElement>('input[data-min-today]')
  if (!field) return
  const now = new Date()
  const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
  field.min = iso
  if (!field.value) field.value = iso
}

/** The visible <label> text, so the e-mail is written in the page's language. */
function labelFor(control: HTMLElement, form: HTMLFormElement): string {
  const label = form.querySelector<HTMLLabelElement>(`label[for="${control.id}"]`)
  return (label?.textContent ?? control.getAttribute('name') ?? '')
    .replace(/\s+/g, ' ')
    // Drop the trailing "(optional)" hint — it belongs on the form, not in the e-mail.
    .replace(/\s*\([^)]*\)\s*$/, '')
    .trim()
}

function composeReservation(form: HTMLFormElement): void {
  const lang = locale()
  const controls = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input[name], select[name], textarea[name]',
    ),
  )

  const lines = controls
    .filter((control) => control.value.trim() !== '')
    .map((control) => `${labelFor(control, form)}: ${control.value.trim()}`)

  const date = form.querySelector<HTMLInputElement>('#rs-date')?.value ?? ''
  const time = form.querySelector<HTMLSelectElement>('#rs-time')?.value ?? ''
  const guests = form.querySelector<HTMLSelectElement>('#rs-guests')?.value ?? ''
  const subject =
    lang === 'pl'
      ? `Rezerwacja: ${date} ${time}, ${guests} os.`
      : `Reservation: ${date} ${time}, ${guests} guests`

  const address = form.dataset.email ?? ''
  const href = `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`

  window.location.href = href

  const status = form.querySelector<HTMLElement>('[data-reserve-status]')
  if (status) status.textContent = STATUS[lang]
}

function wireReservation(): void {
  const form = document.querySelector<HTMLFormElement>('form[data-reserve]')
  if (!form) return
  form.addEventListener('submit', (event) => {
    if (!form.reportValidity()) return
    event.preventDefault()
    composeReservation(form)
  })
}

markToday()
limitDate()
wireReservation()

// Keep one photograph enlarged. Native buttons also support Enter and Space.
function wireDishZoom(): void {
  let active: HTMLButtonElement | null = null
  const close = () => {
    active?.setAttribute('aria-pressed', 'false')
    active = null
  }
  document.addEventListener('click', (event) => {
    const button = event.target instanceof Element
      ? event.target.closest<HTMLButtonElement>('button[data-dish-zoom]')
      : null
    const wasActive = button === active
    close()
    if (button && !wasActive) {
      button.setAttribute('aria-pressed', 'true')
      active = button
    }
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close()
  })
  document.addEventListener('focusin', (event) => {
    if (active && event.target !== active) close()
  })
}

wireDishZoom()
