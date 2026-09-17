/**
 * Verified facts about the restaurant. Every value here was taken from the
 * restaurant's own published material (abyssiniarestobar.pl and the menu PDF it
 * links to). Nothing in this file is inferred, rounded or invented — if a value
 * cannot be confirmed it is omitted rather than guessed.
 */

export const site = {
  name: 'Abyssinia',
  legalName: 'Abyssinia Ethiopian Restaurant & Bar',
  /** The restaurant's own Amharic name, as it writes it. Always rendered lang="am". */
  amharic: 'አቢሲኒያ የኢትዮጵያ ምግብ ቤት',
  street: 'Stefana Batorego 1',
  postalCode: '31-135',
  city: 'Kraków',
  countryCode: 'PL',
  phone: '+48 512 540 600',
  phoneHref: '+48512540600',
  email: 'info@abyssiniarestobar.pl',
  reservationEmail: 'reservationabyssiniarestobar@gmail.com',
  origin: 'https://abyssiniarestobar.pl',
  maps: 'https://www.google.com/maps/search/?api=1&query=Abyssinia+Ethiopian+Restaurant+%26+Bar+Stefana+Batorego+1+Krak%C3%B3w',
  instagram: 'https://www.instagram.com/abyssinia.krakow',
  facebook: 'https://www.facebook.com/AbyssiniaRestobar/',
  /** Party size from which the restaurant asks to be called instead. */
  groupThreshold: 8,
  currency: 'PLN',
} as const

/** 1 = Monday … 7 = Sunday. `null` = closed that day. */
export const hours: { day: number; open: string; close: string }[] = [
  { day: 2, open: '16:00', close: '21:00' },
  { day: 3, open: '16:00', close: '21:00' },
  { day: 4, open: '16:00', close: '21:00' },
  { day: 5, open: '16:00', close: '22:00' },
  { day: 6, open: '15:00', close: '22:00' },
  { day: 7, open: '15:00', close: '22:00' },
]

export const closedDays = [1]

/**
 * Drop a booking provider URL here to switch the reservation section from the
 * e-mail request form to a direct hand-off. Left empty on purpose: at the time
 * of writing no booking system is connected, and the site must not imply one.
 */
export const RESERVATION_PROVIDER_URL = ''
