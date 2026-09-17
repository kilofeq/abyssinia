import type { Copy } from '../content/copy'
import { MesobMark } from './Mesob'
import { FoodImage } from './FoodImage'

export function SharedTable({ copy }: { copy: Copy }) {
  return (
    <section id="table" className="shared-table scroll-mt-28 py-16 sm:py-20 lg:py-24">
      <div className="u-shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="u-eyebrow flex items-center gap-2.5 text-clay">
            <MesobMark className="h-4 w-4" />
            {copy.table.eyebrow}
          </p>
          <h2 className="mt-5 max-w-[16ch] text-(length:--text-title)">
            {copy.table.title}
          </h2>
          <p className="mt-7 max-w-[54ch] text-[1.02rem] leading-[1.68] text-ink/80">
            {copy.table.body}
          </p>

          <div className="mt-10 max-w-[46ch] border-l-2 border-clay/35 pl-5">
            <h3 className="font-display text-[1.1rem]">
              {copy.table.asideTitle}
            </h3>
            <p className="mt-2 text-[0.98rem] leading-[1.6] text-muted">
              {copy.table.aside}
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="table-steps rounded-lg border border-line bg-surface p-7 sm:p-9">
            <h3 className="font-display text-(length:--text-head)">
              {copy.table.stepsTitle}
            </h3>
            <ol className="mt-7 space-y-6">
              {copy.table.steps.map((step, i) => (
                <li key={step.slice(0, 20)} className="eating-step flex items-center gap-4">
                  <FoodImage id={['step-tear', 'step-scoop', 'step-eat'][i] ?? 'step-eat'} className="step-drawing" />
                  <span
                    aria-hidden="true"
                    className="w-7 shrink-0 pt-[0.38rem] text-[0.78rem] font-semibold tracking-[0.12em] text-clay tabular-nums"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="pt-1 text-[1rem] leading-[1.55] text-ink/85">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
