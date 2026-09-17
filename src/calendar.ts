import { addDays } from './booking-rules'
export function calendar(
  container: HTMLElement,
  options: {
    locale: string
    selected: string
    min: string
    max: string
    disabled?: (date: string) => boolean
    counts?: (date: string) => number
    onSelect: (date: string) => void
    onMonth?: (month: string) => void
  },
) {
  let selected = options.selected
  let month = selected.slice(0, 7)
  function draw(focusDate?: string) {
    container.replaceChildren()
    const heading = document.createElement('div')
    heading.className = 'calendar-heading'
    const label = document.createElement('span')
    label.setAttribute('aria-live', 'polite')
    label.textContent = new Intl.DateTimeFormat(options.locale, {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${month}-15T12:00:00Z`))
    for (const direction of [-1, 1]) {
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = direction < 0 ? '←' : '→'
      button.setAttribute(
        'aria-label',
        options.locale === 'pl'
          ? direction < 0
            ? 'Poprzedni miesiąc'
            : 'Następny miesiąc'
          : direction < 0
            ? 'Previous month'
            : 'Next month',
      )
      button.disabled =
        direction < 0
          ? month <= options.min.slice(0, 7)
          : month >= options.max.slice(0, 7)
      button.onclick = () => {
        const d = new Date(`${month}-15T12:00:00Z`)
        d.setUTCMonth(d.getUTCMonth() + direction)
        month = d.toISOString().slice(0, 7)
        draw()
        options.onMonth?.(month)
        ;(
          container.querySelectorAll('.calendar-heading button')[
            direction < 0 ? 0 : 1
          ] as HTMLButtonElement
        )?.focus()
      }
      heading.append(button)
      if (direction < 0) heading.append(label)
    }
    container.append(heading)
    const grid = document.createElement('div')
    grid.className = 'calendar-grid'
    const names =
      options.locale === 'pl'
        ? ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd']
        : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    for (const name of names) {
      const cell = document.createElement('span')
      cell.className = 'calendar-weekday'
      cell.textContent = name
      grid.append(cell)
    }
    const first = `${month}-01`
    const start = (new Date(`${first}T12:00:00Z`).getUTCDay() + 6) % 7
    for (let i = 0; i < start; i++) grid.append(document.createElement('span'))
    for (let n = 0; n < 31; n++) {
      const date = addDays(first, n)
      if (!date.startsWith(month)) break
      const b = document.createElement('button')
      b.type = 'button'
      b.className = 'calendar-day'
      b.textContent = String(n + 1)
      b.dataset.date = date
      b.disabled =
        date < options.min ||
        date > options.max ||
        Boolean(options.disabled?.(date))
      b.setAttribute('aria-pressed', String(date === selected))
      b.setAttribute(
        'aria-label',
        new Intl.DateTimeFormat(options.locale, {
          dateStyle: 'full',
          timeZone: 'UTC',
        }).format(new Date(`${date}T12:00:00Z`)),
      )
      const count = options.counts?.(date) ?? 0
      if (count) {
        const dot = document.createElement('small')
        dot.textContent = String(count)
        b.append(dot)
        b.setAttribute(
          'aria-label',
          `${b.getAttribute('aria-label')}, ${options.locale === 'pl' ? 'liczba rezerwacji:' : 'reservations:'} ${count}`,
        )
      }
      b.onclick = () => {
        selected = date
        draw(date)
        options.onSelect(date)
      }
      b.onkeydown = (e) => {
        const step = (
          { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 } as Record<
            string,
            number
          >
        )[e.key]
        if (!step) return
        e.preventDefault()
        let next = addDays(date, step)
        for (let i = 0; i < 95; i++) {
          if (next < options.min || next > options.max) return
          if (!options.disabled?.(next)) break
          next = addDays(next, step > 0 ? 1 : -1)
        }
        month = next.slice(0, 7)
        draw(next)
        options.onMonth?.(month)
      }
      grid.append(b)
    }
    container.append(grid)
    if (focusDate)
      container
        .querySelector<HTMLButtonElement>(`[data-date="${focusDate}"]`)
        ?.focus()
  }
  draw()
  return {
    select(date: string) {
      selected = date
      month = date.slice(0, 7)
      draw()
    },
    refresh() {
      draw()
    },
  }
}
