import { hours } from './content/site'
export const bookingWindowDays = 90
export function warsawNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (key: string) => parts.find((p) => p.type === key)!.value
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    time: `${get('hour')}:${get('minute')}`,
  }
}
export function addDays(date: string, days: number) {
  return new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000)
    .toISOString()
    .slice(0, 10)
}
export function validDate(date: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(Date.parse(`${date}T12:00:00Z`)) &&
    new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) === date
  )
}
export function bookingTimes(date: string, now = new Date()): string[] {
  if (!validDate(date)) return []
  const current = warsawNow(now)
  if (date < current.date || date > addDays(current.date, bookingWindowDays))
    return []
  const day = new Date(`${date}T12:00:00Z`).getUTCDay() || 7
  const schedule = hours.find((h) => h.day === day)
  if (!schedule) return []
  const minutes = (time: string) =>
    Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
  const result: string[] = []
  // Requests stop one hour before closing; this is not a claim of live availability.
  for (
    let m = minutes(schedule.open);
    m <= minutes(schedule.close) - 60;
    m += 30
  ) {
    if (date === current.date && m < minutes(current.time) + 60) continue
    result.push(
      `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`,
    )
  }
  return result
}
