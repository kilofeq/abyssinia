import './styles.css'
import { wireBooking } from './booking-client'

const day = new Date().getDay() || 7
document.querySelectorAll(`[data-hours] [data-day="${day}"] th`).forEach(cell => cell.setAttribute('data-today', ''))
wireBooking()

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
