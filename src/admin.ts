import './styles.css'
import { calendar } from './calendar'
import { addDays, warsawNow } from './booking-rules'
type Reservation = {
  id: string
  date: string
  time: string
  guests: number
  name: string
  email: string
  phone: string
  notes: string
  locale: string
  status: string
  version: number
}
const $ = <T extends HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!
let token = ''
let rows: Reservation[] = []
let selected = warsawNow().date
let month = selected.slice(0, 7)
let sequence = 0
const status = $('#admin-status')
const labels: Record<string, string> = {
  pending: 'Oczekuje',
  confirmed: 'Potwierdzona',
  declined: 'Odrzucona',
  cancelled: 'Anulowana',
}
const cal = calendar($('#admin-calendar'), {
  locale: 'pl',
  selected,
  min: addDays(selected, -90),
  max: addDays(selected, 90),
  counts: (d) =>
    rows.filter(
      (r) => r.date === d && ['pending', 'confirmed'].includes(r.status),
    ).length,
  onSelect: (d) => {
    selected = d
    draw()
  },
  onMonth: (m) => {
    if (m !== month) {
      month = m
      void load()
    }
  },
})
async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
  })
  if (!res.ok)
    throw new Error(
      res.status === 401
        ? 'Nieprawidłowy klucz dostępu.'
        : res.status === 409
          ? 'Rezerwacja zmieniła się w innym oknie. Odśwież listę.'
          : res.status === 429
            ? 'Zbyt wiele prób. Spróbuj ponownie za 10 minut.'
            : 'Nie udało się połączyć. Spróbuj ponownie.',
    )
  return res.json()
}
async function load() {
  const current = ++sequence
  status.textContent = 'Wczytujemy rezerwacje…'
  try {
    const data = await api(`/api/admin/reservations?month=${month}`)
    if (current !== sequence) return
    rows = data.reservations
    $('#login').hidden = true
    $('#dashboard').hidden = false
    $('#logout').hidden = false
    cal.refresh()
    draw()
    status.textContent = data.truncated
      ? 'Lista jest zbyt długa. Pokazano pierwsze 2000 zgłoszeń.'
      : ''
  } catch (error) {
    if (current === sequence) status.textContent = (error as Error).message
  }
}
function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text: string,
  className = '',
) {
  const node = document.createElement(tag)
  node.textContent = text
  node.className = className
  return node
}
function draw() {
  const list = $('#reservations')
  list.replaceChildren()
  const items = rows.filter((r) => r.date === selected)
  $('#day-title').textContent = new Intl.DateTimeFormat('pl', {
    dateStyle: 'full',
    timeZone: 'UTC',
  }).format(new Date(`${selected}T12:00:00Z`))
  $('#day-count').textContent =
    `Zgłoszenia: ${items.length} · ${items.filter((r) => r.status === 'confirmed').reduce((n, r) => n + r.guests, 0)} potwierdzonych gości`
  if (!items.length) {
    const empty = element('div', '', 'admin-empty')
    empty.append(
      element('span', '☀'),
      element('h3', 'Brak rezerwacji'),
      element('p', 'Na ten dzień nie ma jeszcze zgłoszeń.'),
    )
    list.append(empty)
  }
  for (const row of items) {
    const card = element('article', '', 'reservation-card')
    const top = element('div', '', 'reservation-top')
    top.append(
      element('strong', row.time),
      element('span', `${row.guests} os.`),
      element(
        'span',
        labels[row.status] ?? row.status,
        `reservation-status ${row.status}`,
      ),
    )
    card.append(top, element('h3', row.name))
    const contact = element('div', '', 'reservation-contact')
    const mail = element('a', row.email)
    mail.href = `mailto:${encodeURIComponent(row.email)}`
    contact.append(mail)
    if (row.phone) {
      const phone = element('a', row.phone)
      phone.href = `tel:${row.phone.replace(/[^+\d]/g, '')}`
      contact.append(phone)
    }
    card.append(contact)
    if (row.notes) card.append(element('p', row.notes, 'reservation-notes'))
    card.append(
      element(
        'p',
        `Język kontaktu: ${row.locale === 'en' ? 'angielski' : 'polski'}`,
        'booking-help',
      ),
    )
    const actions = element('div', '', 'reservation-actions')
    for (const [value, label] of row.status === 'pending'
      ? [
          ['confirmed', 'Potwierdź'],
          ['declined', 'Odrzuć'],
        ]
      : row.status === 'confirmed'
        ? [['cancelled', 'Anuluj']]
        : [['pending', 'Przywróć']]) {
      const b = element('button', label!)
      b.type = 'button'
      b.onclick = async () => {
        if (
          !confirm(
            `${label} rezerwację: ${row.name}, ${row.date}, ${row.time}? Zmiana statusu nie wysyła wiadomości do gościa.`,
          )
        )
          return
        b.disabled = true
        try {
          await api(`/api/admin/reservations/${row.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: value, version: row.version }),
          })
          await load()
        } catch (error) {
          status.textContent = (error as Error).message
          b.disabled = false
        }
      }
      actions.append(b)
    }
    card.append(actions)
    list.append(card)
  }
}
$('#login-form').addEventListener('submit', (event) => {
  event.preventDefault()
  token = $<HTMLInputElement>('#admin-key').value
  $<HTMLInputElement>('#admin-key').value = ''
  void load()
})
$('#refresh').onclick = () => void load()
$('#logout').onclick = () => {
  sequence++
  token = ''
  rows = []
  $('#reservations').replaceChildren()
  $('#dashboard').hidden = true
  $('#login').hidden = false
  $('#logout').hidden = true
  status.textContent = ''
  $<HTMLInputElement>('#admin-key').focus()
}
