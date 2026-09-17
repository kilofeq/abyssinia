/**
 * All user-facing prose, in both locales. Both objects share one type, so a
 * string can never exist in one language and silently go missing in the other.
 *
 * Written by hand. Two earlier drafts were generated and then patched, and both
 * read like translated marketing — this one is deliberately short. A restaurant
 * page is signage, not an essay: say what the food is, where the place is, and
 * how to get a table. Anything a guest would not stop to read has been cut.
 *
 * {n} placeholders are filled at render time from the menu data, so a count in
 * the copy cannot drift out of step with the dishes actually listed.
 */

export type Locale = 'pl' | 'en'

export type Copy = {
  locale: Locale
  /** Path this locale is served from. */
  path: string
  alt: { locale: Locale; path: string; label: string }
  skipToContent: string
  meta: { title: string; description: string }
  nav: { table: string; room: string; menu: string; visit: string; reserve: string; label: string }
  hero: { kicker: string; lead: string; ctaPrimary: string; ctaSecondary: string; photoAlt: string }
  table: {
    eyebrow: string
    title: string
    body: string
    stepsTitle: string
    steps: string[]
  }
  gallery: { eyebrow: string; title: string }
  menu: {
    eyebrow: string
    title: string
    veganLine: string
    veganShort: string
    note: string
    jump: string
  }
  visit: {
    eyebrow: string
    title: string
    addressTitle: string
    hoursTitle: string
    closed: string
    directions: string
    contactTitle: string
    followTitle: string
  }
  reserve: {
    eyebrow: string
    title: string
    lead: string
    callTitle: string
    groupNote: string
    formTitle: string
    name: string
    namePlaceholder: string
    email: string
    phone: string
    phoneOptional: string
    guests: string
    date: string
    time: string
    notes: string
    notesPlaceholder: string
    submit: string
    disclaimer: string
    noscript: string
    providerCta: string
  }
  footer: {
    tagline: string
    quickTitle: string
    contactTitle: string
    hoursTitle: string
    rights: string
  }
  days: string[]
  daysShort: string[]
}

export const pl: Copy = {
  locale: 'pl',
  path: '/',
  alt: { locale: 'en', path: '/en/', label: 'English' },
  skipToContent: 'Przejdź do treści',
  meta: {
    title: 'Abyssinia — kuchnia etiopska w Krakowie',
    description:
      'Etiopska restauracja i bar przy Batorego 1 w Krakowie. Dania mięsne i {n} wegańskich, podawane na injerze. Karta, godziny, rezerwacja.',
  },
  nav: {
    table: 'Kuchnia',
    room: 'Wnętrze',
    menu: 'Menu',
    visit: 'Kontakt',
    reserve: 'Rezerwacja',
    label: 'Nawigacja główna',
  },
  hero: {
    kicker: 'Kuchnia etiopska — Kraków, Batorego 1',
    lead: 'Kuchnia etiopska w centrum Krakowa. Dania mięsne i wegańskie, injera oraz tradycyjna kawa.',
    ctaPrimary: 'Zarezerwuj stolik',
    ctaSecondary: 'Zobacz menu',
    photoAlt:
      'Główna sala pod ceglanym sklepieniem: stoliki nakryte plecionymi mesobami i wiszące lampy z plecionki.',
  },
  table: {
    eyebrow: 'Kuchnia etiopska',
    title: 'Dania do dzielenia',
    body:
      'Dania podajemy na wspólnym talerzu z injerą — etiopskim plackiem, którym nabiera się jedzenie.',
    stepsTitle: 'Jak jeść injerę?',
    steps: [
      'Prawą ręką oderwij kawałek injery.',
      'Nabierz nim jedzenie z talerza.',
      'Włóż do ust.',
    ],
  },
  gallery: {
    eyebrow: 'Galeria',
    title: 'Nasza restauracja',
  },
  menu: {
    eyebrow: 'Menu',
    title: 'Karta dań',
    veganLine: 'W menu znajdziesz również {n} dań wegańskich.',
    veganShort: 'wege',
    note: 'Ceny w złotych. Masz alergię albo czegoś nie jesz? Powiedz nam przy zamówieniu.',
    jump: 'Przejdź do dań',
  },
  visit: {
    eyebrow: 'Kontakt',
    title: 'Batorego 1, Kraków',
    addressTitle: 'Adres',
    hoursTitle: 'Godziny',
    closed: 'nieczynne',
    directions: 'Wyznacz trasę',
    contactTitle: 'Kontakt',
    followTitle: 'Obserwuj nas',
  },
  reserve: {
    eyebrow: 'Rezerwacja',
    title: 'Zarezerwuj stolik',
    lead: 'Wypełnij formularz lub zadzwoń.',
    callTitle: 'Telefon',
    groupNote: 'Grupy od {n} osób prosimy o telefon.',
    formTitle: 'Zaplanuj wizytę',
    name: 'Imię i nazwisko',
    namePlaceholder: 'Jan Kowalski',
    email: 'E-mail',
    phone: 'Telefon',
    phoneOptional: 'opcjonalnie',
    guests: 'Liczba osób',
    date: 'Data',
    time: 'Godzina',
    notes: 'Uwagi',
    notesPlaceholder: 'Alergie, okazja, wózek…',
    submit: 'Wyślij prośbę o rezerwację',
    disclaimer: 'Poczekaj na potwierdzenie rezerwacji.',
    noscript: 'Aby zarezerwować stolik, zadzwoń lub napisz do nas.',
    providerCta: 'Rezerwuj online',
  },
  footer: {
    tagline: 'Kuchnia etiopska w Krakowie.',
    quickTitle: 'Na skróty',
    contactTitle: 'Kontakt',
    hoursTitle: 'Godziny',
    rights: 'Wszelkie prawa zastrzeżone.',
  },
  days: ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'],
  daysShort: ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'],
}

export const en: Copy = {
  locale: 'en',
  path: '/en/',
  alt: { locale: 'pl', path: '/', label: 'Polski' },
  skipToContent: 'Skip to content',
  meta: {
    title: 'Abyssinia — Ethiopian food in Kraków',
    description:
      'Ethiopian restaurant and bar at Batorego 1, Kraków. Meat dishes and {n} vegan ones, served on injera. Menu, hours, reservations.',
  },
  nav: {
    table: 'Cuisine',
    room: 'Gallery',
    menu: 'Menu',
    visit: 'Contact',
    reserve: 'Reserve',
    label: 'Main navigation',
  },
  hero: {
    kicker: 'Ethiopian food — Kraków, Batorego 1',
    lead: 'Ethiopian cuisine in central Kraków. Meat and vegan dishes, injera and traditional coffee.',
    ctaPrimary: 'Book a table',
    ctaSecondary: 'Menu',
    photoAlt:
      'The main dining room under a brick vault: tables set with woven mesob baskets, and woven pendant lamps.',
  },
  table: {
    eyebrow: 'Ethiopian cuisine',
    title: 'Sharing platters',
    body:
      'Dishes come on a shared platter with injera — an Ethiopian flatbread used to scoop up the food.',
    stepsTitle: 'How to eat injera',
    steps: [
      'Tear off a piece of injera with your right hand.',
      'Use it to pick up food from the platter.',
      'Enjoy your bite.',
    ],
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'Our restaurant',
  },
  menu: {
    eyebrow: 'Menu',
    title: 'What we serve',
    veganLine: 'Our menu also includes {n} vegan dishes.',
    veganShort: 'vegan',
    note: 'Prices in złoty. Allergies or anything you avoid? Tell us when you order.',
    jump: 'Jump to a section',
  },
  visit: {
    eyebrow: 'Contact',
    title: 'Batorego 1, Kraków',
    addressTitle: 'Address',
    hoursTitle: 'Hours',
    closed: 'closed',
    directions: 'Get directions',
    contactTitle: 'Contact',
    followTitle: 'Online',
  },
  reserve: {
    eyebrow: 'Reservations',
    title: 'Book a table',
    lead: 'Fill in the form or give us a call.',
    callTitle: 'Phone',
    groupNote: 'For parties of {n} or more, please call.',
    formTitle: 'Plan your visit',
    name: 'Full name',
    namePlaceholder: 'Jan Kowalski',
    email: 'Email',
    phone: 'Phone',
    phoneOptional: 'optional',
    guests: 'Guests',
    date: 'Date',
    time: 'Time',
    notes: 'Notes',
    notesPlaceholder: 'Allergies, occasion, pushchair…',
    submit: 'Request a table',
    disclaimer: 'Please wait for us to confirm your booking.',
    noscript: 'Call or email us to book a table.',
    providerCta: 'Book online',
  },
  footer: {
    tagline: 'Ethiopian food in Kraków.',
    quickTitle: 'Shortcuts',
    contactTitle: 'Contact',
    hoursTitle: 'Hours',
    rights: 'All rights reserved.',
  },
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

export const locales: Record<Locale, Copy> = { pl, en }
