import type { Copy } from '../content/copy'
import { photos, gallerySizes } from '../content/gallery'

/**
 * The room, in the restaurant's own photographs.
 *
 * Every image ships as AVIF and WebP at three widths (scripts/build-images.mjs)
 * and carries its intrinsic width/height, so the browser reserves the space
 * before the file arrives and nothing on the page moves. All of it sits below
 * the fold, so all of it is lazy — the largest paint is still the headline.
 */
export function Gallery({ copy }: { copy: Copy }) {
  const { widths } = gallerySizes

  return (
    <section id="room" className="scroll-mt-28 border-t border-line bg-surface py-16 sm:py-24 lg:py-28">
      <div className="u-shell">
        <div className="max-w-2xl">
          <p className="u-eyebrow text-clay">{copy.gallery.eyebrow}</p>
          <h2 className="mt-5 text-(length:--text-title)">{copy.gallery.title}</h2>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:mt-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {photos.map((photo, i) => {
            const size = gallerySizes.photos[photo.id]
            const srcset = (ext: string) =>
              widths
                .filter((w) => w <= size.width)
                .map((w) => `/gallery/${photo.id}-${w}.${ext} ${w}w`)
                .join(', ')

            return (
              <li
                key={photo.id}
                // A slight stagger on the middle column keeps the grid from
                // reading as a contact sheet.
                className={i % 3 === 1 ? 'lg:mt-12' : undefined}
              >
                <figure className="m-0">
                  <picture>
                    <source type="image/avif" srcSet={srcset('avif')} sizes={SIZES} />
                    <source type="image/webp" srcSet={srcset('webp')} sizes={SIZES} />
                    <img
                      src={`/gallery/${photo.id}-480.webp`}
                      alt={photo.alt[copy.locale]}
                      width={size.width}
                      height={size.height}
                      loading="lazy"
                      decoding="async"
                      sizes={SIZES}
                      className="h-auto w-full rounded-sm bg-linesoft object-cover"
                    />
                  </picture>
                  <figcaption className="mt-3 text-[0.84rem] leading-[1.5] text-muted">
                    {photo.caption[copy.locale]}
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/**
 * The exact rendered width at every breakpoint, derived from the grid above:
 * two columns below 64rem and three at or above it, minus the shell padding
 * (1.25rem, then 2.5rem from 48rem) and the column gap (1rem, 1.5rem, 2rem).
 * Guessing here is what makes a browser download a file twice the size it needs.
 */
const SIZES = [
  '(min-width: 82rem) 368px',
  '(min-width: 64rem) calc(33.33vw - 48px)',
  '(min-width: 48rem) calc(50vw - 52px)',
  '(min-width: 40rem) calc(50vw - 32px)',
  'calc(50vw - 28px)',
].join(', ')
