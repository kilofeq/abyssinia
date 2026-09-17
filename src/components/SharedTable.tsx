import type { Copy } from '../content/copy'
import { MesobMark } from './Mesob'
import { FoodImage } from './FoodImage'

export function SharedTable({ copy }: { copy: Copy }) {
  return (
    <section id="table" className="shared-table scroll-mt-28 py-12 sm:py-16 lg:py-20">
      <div className="u-shell grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:py-6">
          <p className="u-eyebrow flex items-center gap-2.5 text-clay">
            <MesobMark className="h-4 w-4" />
            {copy.table.eyebrow}
          </p>
          <h2 className="mt-4 max-w-[16ch] text-(length:--text-title)">
            {copy.table.title}
          </h2>
          <p className="mt-5 max-w-[42ch] text-[1.02rem] leading-[1.68] text-ink/80">
            {copy.table.body}
          </p>

        </div>

        <div className="min-w-0">
          <div className="table-steps rounded-lg border border-line bg-surface p-6 sm:p-8 lg:p-10">
            <h3 className="font-display text-(length:--text-head)">
              {copy.table.stepsTitle}
            </h3>
            <ol className="mt-6 space-y-4">
              {copy.table.steps.map((step, i) => (
                <li key={step.slice(0, 20)} className="eating-step flex items-center gap-4">
                  <FoodImage id={['step-tear', 'step-scoop', 'step-eat'][i] ?? 'step-eat'} className="step-drawing" />
                  <span className="min-w-0 text-[1rem] leading-[1.55] text-ink/85">
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
