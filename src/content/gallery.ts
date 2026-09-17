/**
 * The restaurant's own photographs, taken from the gallery of the current site.
 *
 * Six of the nine are used. Two are deliberately left out: one carries a
 * third-party brand sign, and one shows a member of staff's face closely enough
 * to identify them. Nothing here is stock, generated or staged for the site.
 *
 * Each photo carries two strings, on purpose. `caption` is the short label
 * printed under the frame; `alt` is the full description read aloud. Using one
 * string for both made a screen reader say the same sentence twice.
 *
 * Both describe only what is actually visible in the frame.
 */
import sizes from './gallery-sizes.json'
import type { Bi } from './menu'

export type Photo = {
  /** Base filename in /gallery, without width or extension. */
  id: keyof typeof sizes.photos
  /** Short visible label. */
  caption: Bi
  /** Full description, for anyone who cannot see the photograph. */
  alt: Bi
}

export const photos: Photo[] = [
  {
    id: 'inside9',
    caption: { pl: 'Główna sala', en: 'The main room' },
    alt: {
      pl: 'Główna sala pod ceglanym sklepieniem: stoliki nakryte plecionymi mesobami i wiszące lampy z plecionki.',
      en: 'The main dining room under a brick vault: tables set with woven mesob baskets, and woven pendant lamps.',
    },
  },
  {
    id: 'inside1',
    caption: { pl: 'Bar', en: 'The bar' },
    alt: {
      pl: 'Bar z neonem, na którym nazwa restauracji świeci po amharsku w barwach etiopskiej flagi.',
      en: "The bar, where a neon sign spells the restaurant's name in Amharic in the colours of the Ethiopian flag.",
    },
  },
  {
    id: 'inside6',
    caption: { pl: 'Ceremonia kawowa', en: 'The coffee ceremony' },
    alt: {
      pl: 'Kącik ceremonii kawowej: gliniane dzbanki jebena, plecione kosze i tkaniny w pasy.',
      en: 'The coffee ceremony corner: clay jebena pots, woven baskets and striped cloth.',
    },
  },
  {
    id: 'inside3',
    caption: { pl: 'Stolik z mesobem', en: 'A table laid with a mesob' },
    alt: {
      pl: 'Stolik z zamkniętym mesobem, obok tablica z etiopskim alfabetem na ceglanej ścianie.',
      en: 'A table with a closed mesob, beside a chart of the Ethiopian alphabet on the brick wall.',
    },
  },
  {
    id: 'inside7',
    caption: { pl: 'Druga sala', en: 'The second room' },
    alt: {
      pl: 'Druga sala z ceglanym sklepieniem; przejście zasłonięte tkaniną w barwach flagi.',
      en: 'The second vaulted room, its doorway hung with cloth in the colours of the flag.',
    },
  },
  {
    id: 'inside8',
    caption: { pl: 'Osobna salka', en: 'The private room' },
    alt: {
      pl: 'Osobna salka z narożną kanapą i niskim stolikiem, pod plecioną lampą.',
      en: 'The private room, with a corner sofa and a low table under a woven lamp.',
    },
  },
]

export const gallerySizes = sizes
