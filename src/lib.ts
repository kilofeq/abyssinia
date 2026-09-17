import { site, hours } from './content/site'
import type { Copy } from './content/copy'
import { courses } from './content/menu'

export type HourRow = { day: number; label: string; value: string; closed: boolean }

/** Monday-first rows for display, merging the closed days back in. */
export function hourRows(copy: Copy): HourRow[] {
  return [1, 2, 3, 4, 5, 6, 7].map((day) => {
    const open = hours.find((h) => h.day === day)
    return {
      day,
      label: copy.days[day - 1] ?? '',
      value: open ? `${open.open} – ${open.close}` : copy.visit.closed,
      closed: !open,
    }
  })
}

export function formatPrice(value: number, locale: Copy['locale']): string {
  return locale === 'pl' ? `${value} zł` : `${value} PLN`
}

export const veganDishCount =
  courses.find((c) => c.id === 'vegan')?.dishes.length ?? 0

/** Fills the {n} placeholder so the meta text cannot drift from the menu data. */
export function metaDescription(copy: Copy): string {
  return copy.meta.description.replace('{n}', String(veganDishCount))
}

/**
 * schema.org Restaurant. Built from the same verified constants the page
 * renders, so the structured data can never drift from the visible content.
 */
export function structuredData(copy: Copy) {
  const dayName = (d: number) =>
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][d - 1]

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${site.origin}/#restaurant`,
    name: site.legalName,
    alternateName: site.amharic,
    description: metaDescription(copy),
    url: `${site.origin}${copy.path}`,
    telephone: site.phone,
    email: site.email,
    servesCuisine: 'Ethiopian',
    priceRange: '$$',
    currenciesAccepted: site.currency,
    hasMenu: `${site.origin}${copy.path}#menu`,
    acceptsReservations: true,
    image: [`${site.origin}/food/vegan-combo.webp`, `${site.origin}/gallery/inside9-960.webp`],
    logo: `${site.origin}/brand/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      addressLocality: site.city,
      postalCode: site.postalCode,
      addressCountry: site.countryCode,
    },
    openingHoursSpecification: hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayName(h.day)}`,
      opens: h.open,
      closes: h.close,
    })),
    sameAs: [site.instagram, site.facebook],
  }
}
