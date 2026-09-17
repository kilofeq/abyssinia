/**
 * Builds the gallery assets from the restaurant's own photographs in reference/.
 *
 * Each photo goes out as AVIF and WebP at three widths. The source files are
 * 960×1280, so nothing is upscaled. Dimensions are written to
 * src/content/gallery-sizes.json so the markup can carry width/height and
 * reserve the space before the image arrives — that is what keeps CLS at 0.
 *
 *   node scripts/build-images.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const WIDTHS = [320, 400, 480, 640, 800, 960]
const OUT = 'public/gallery'

/** Chosen from the nine photos on the current site. Two are deliberately left
 *  out: one carries a third-party brand sign, one shows a staff member's face. */
const PHOTOS = [
  'inside9', // main dining room under the vault
  'inside1', // the bar, Amharic neon
  'inside6', // coffee ceremony corner
  'inside3', // mesob on a laid table
  'inside7', // second dining room
  'inside8', // private room
]

await mkdir(OUT, { recursive: true })

/**
 * The hero gets its own renditions, for two reasons. Small screens show a
 * landscape crop of a portrait photograph, so shipping the whole frame and
 * hiding 44% of it in CSS wastes most of the largest download on the page; and
 * as the LCP element it is worth encoding harder than the gallery thumbnails.
 */
const HERO = 'inside9'
const HERO_WIDTHS = [400, 480, 560, 680, 760, 960]
const HERO_WIDE_MAX = 760

{
  const src = `reference/${HERO}.jpg`
  const { width, height } = await sharp(src).metadata()
  // Crop to 4:3 around the part of the frame the room is actually in, matching
  // the object-position the CSS would otherwise apply.
  const cropH = Math.round(width * 3 / 4)
  const top = Math.round((height - cropH) * 0.72)

  for (const w of HERO_WIDTHS) {
    const tall = sharp(src).resize({ width: w, withoutEnlargement: true })
    await tall.clone().avif({ quality: 45, effort: 9 }).toFile(`${OUT}/hero-tall-${w}.avif`)
    await tall.clone().webp({ quality: 70, effort: 6 }).toFile(`${OUT}/hero-tall-${w}.webp`)

    if (w > HERO_WIDE_MAX) continue
    const wide = sharp(src)
      .extract({ left: 0, top, width, height: cropH })
      .resize({ width: w, withoutEnlargement: true })
    await wide.clone().avif({ quality: 45, effort: 9 }).toFile(`${OUT}/hero-wide-${w}.avif`)
    await wide.clone().webp({ quality: 70, effort: 6 }).toFile(`${OUT}/hero-wide-${w}.webp`)
  }
  console.log(`  hero renditions from ${HERO} (${width}x${height}, wide crop ${width}x${cropH})`)
}

const meta = {}
for (const name of PHOTOS) {
  const src = `reference/${name}.jpg`
  const { width, height } = await sharp(src).metadata()
  meta[name] = { width, height }

  for (const w of WIDTHS) {
    if (w > width) continue
    const base = sharp(src).resize({ width: w, withoutEnlargement: true })
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(`${OUT}/${name}-${w}.avif`)
    await base.clone().webp({ quality: 74, effort: 6 }).toFile(`${OUT}/${name}-${w}.webp`)
  }
  console.log(`  ${name}  ${width}×${height}`)
}

await writeFile(
  'src/content/gallery-sizes.json',
  JSON.stringify(
    { widths: WIDTHS, hero: { widths: HERO_WIDTHS, wideMax: HERO_WIDE_MAX }, photos: meta },
    null,
    2,
  ) + '\n',
)
console.log('\nwrote src/content/gallery-sizes.json')
