import type { Copy } from '../content/copy'
import { courses, type Dish } from '../content/menu'
import { formatPrice, veganDishCount } from '../lib'
import { MesobMark } from './Mesob'
import { FoodImage } from './FoodImage'
import foodSizes from '../content/food-sizes.json'
import { foodAlt } from '../content/food-alt'

function Price({ dish, copy }: { dish: Dish; copy: Copy }) {
  if (dish.price === undefined) return null
  return (
    <span className="shrink-0 font-display text-[1.02rem]">
      {formatPrice(dish.price, copy.locale)}
    </span>
  )
}

function Tiers({ dish, copy }: { dish: Dish; copy: Copy }) {
  if (!dish.tiers) return null
  return (
    <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5">
      {dish.tiers.map((tier) => (
        <div key={tier.label.en} className="flex items-baseline gap-2">
          <dt className="text-[0.86rem] text-muted">{tier.label[copy.locale]}</dt>
          <dd className="font-display text-[0.96rem]">
            {formatPrice(tier.price, copy.locale)}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function DishRow({ dish, copy }: { dish: Dish; copy: Copy }) {
  return (
    <li className="dish-row break-inside-avoid border-t border-linesoft py-5 first:border-t-0 first:pt-0 md:[&:nth-child(2)]:border-t-0 md:[&:nth-child(2)]:pt-0">
      {dish.id in foodSizes && (
        <button type="button" className="dish-zoom" data-dish-zoom aria-pressed="false"
          aria-label={`${copy.locale === 'pl' ? 'Powiększenie zdjęcia' : 'Enlarge photo'}: ${dish.name}`}>
          <FoodImage id={dish.id} alt={foodAlt[dish.id]?.[copy.locale] ?? dish.name} className="dish-photo" />
          <span className="dish-zoom-hint" aria-hidden="true">+</span>
        </button>
      )}
      <div className="dish-info">
      <div className="flex items-baseline gap-2">
        <h4 className="font-display text-[1.08rem] tracking-tight">
          {dish.name}
        </h4>
        {dish.vegan && (
          <span className="rounded-full border border-moss/35 px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.1em] text-moss uppercase">
            {copy.menu.veganShort}
          </span>
        )}
        <span className="u-leader" aria-hidden="true" />
        <Price dish={dish} copy={copy} />
      </div>
      {dish.note && (
        <p className="mt-1.5 max-w-[52ch] text-[0.92rem] leading-[1.55] text-muted">
          {dish.note[copy.locale]}
        </p>
      )}
      <Tiers dish={dish} copy={copy} />
      </div>
    </li>
  )
}

export function Menu({ copy }: { copy: Copy }) {
  return (
    <section id="menu"
      className="scroll-mt-28 border-y border-line bg-surface py-16 sm:py-24 lg:py-24"
    >
      <div className="u-shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="u-eyebrow flex items-center gap-2.5 text-clay">
              <MesobMark className="h-4 w-4" />
              {copy.menu.eyebrow}
            </p>
            <h2 className="mt-5 text-(length:--text-title)">{copy.menu.title}</h2>
            <p className="mt-6 max-w-[42ch] text-[0.98rem] leading-[1.6] text-moss">
              {copy.menu.veganLine.replace('{n}', String(veganDishCount))}
            </p>
          </div>

          <nav aria-label={copy.menu.jump} className="lg:col-span-7 lg:pt-3">
            <ul className="flex flex-wrap gap-2.5">
              {courses.map((course) => (
                <li key={course.id}>
                  <a
                    href={`#menu-${course.id}`}
                    className="inline-block rounded-full border border-line px-4 py-2 text-[0.86rem] text-ink no-underline transition-colors hover:border-clay hover:text-clay"
                  >
                    {course.title[copy.locale]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 space-y-16 sm:mt-16 lg:space-y-20">
          {courses.map((course) => (
            <div key={course.id} id={`menu-${course.id}`} className="scroll-mt-32">
              <div className="u-weave-rule" aria-hidden="true" />
              <div className="mt-7 grid gap-8 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-3">
                  <h3 className="font-display text-(length:--text-head)">
                    {course.title[copy.locale]}
                  </h3>
                  {course.intro && (
                    <p className="mt-3 max-w-[34ch] text-[0.92rem] leading-[1.55] text-muted">
                      {course.intro[copy.locale]}
                    </p>
                  )}
                </div>
                <ul className="lg:col-span-9 md:grid md:grid-cols-2 md:gap-x-12">
                  {course.dishes.map((dish) => (
                    <DishRow key={dish.id} dish={dish} copy={copy} />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-16 max-w-[62ch] border-t border-line pt-7 text-[0.85rem] leading-[1.6] text-muted">
          {copy.menu.note}
        </p>
      </div>
    </section>
  )
}
