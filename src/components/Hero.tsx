import type { Copy } from '../content/copy'
import { site } from '../content/site'
import { Mesob } from './Mesob'
import { FoodImage } from './FoodImage'

export function Hero({ copy }: { copy: Copy }) {
  const pl = copy.locale === 'pl'
  return (
    <section className="food-hero relative overflow-hidden" aria-labelledby="hero-title">
      <div className="u-shell relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-8">
          <div className="@container relative z-10">
            <p className="u-eyebrow text-clay">{copy.hero.kicker}</p>
            <h1 id="hero-title" className="mt-5 text-[clamp(2.75rem,17cqw,7rem)] leading-[0.95] tracking-[-0.03em] text-clay">{site.name}</h1>
            <p lang="am" className="mt-5 text-[1.05rem] text-moss sm:text-[1.2rem]">{site.amharic}</p>
            <p className="mt-7 max-w-[34ch] text-(length:--text-lead) leading-[1.5]">{copy.hero.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#reserve" className="rounded-full bg-clay px-6 py-3.5 text-[0.95rem] font-semibold text-oncream no-underline transition-colors hover:bg-ink">{copy.hero.ctaPrimary}</a>
              <a href="#menu" className="rounded-full border border-moss/40 px-6 py-3.5 text-[0.95rem] font-semibold text-moss no-underline transition-colors hover:bg-moss hover:text-oncream">{copy.hero.ctaSecondary}</a>
            </div>
          </div>
          <figure className="hero-platter relative m-0">
            <Mesob className="platter-weave" />
            <div className="platter-disc" aria-hidden="true" />
            <FoodImage id="vegan-combo" eager alt={pl ? 'Talerz do dzielenia: kolorowe dania wegańskie i rulony injery w plecionym koszu.' : 'A sharing platter of colourful vegan dishes and rolled injera in a woven basket.'} className="relative z-10 mx-auto w-[92%] drop-shadow-xl" />
            <figcaption className="platter-caption"><span>{pl ? 'Talerz wegański' : 'Vegan platter'}</span><span className="mt-1 block font-sans text-xs tracking-wide">{pl ? 'Injera · warzywa · etiopskie przyprawy' : 'Injera · vegetables · Ethiopian spices'}</span></figcaption>
          </figure>
        </div>
      </div>
      <div className="u-weave-rule" aria-hidden="true" />
    </section>
  )
}
