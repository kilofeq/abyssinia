/**
 * The site's single ornament: a mesob seen from above.
 *
 * A mesob is the woven basket-table an Ethiopian meal is served on; the
 * restaurant serves one on its menu ("traditional food basket"). Drawn here as
 * concentric rings whose dashes step round the circle, which is what gives
 * basketry its rhythm. Flat vector, no filters, no animation, ~20 nodes.
 *
 * Decorative only — always hidden from assistive technology.
 */

type Ring = { r: number; w: number; dash: string; offset: number }

function rings(count: number): Ring[] {
  const out: Ring[] = []
  for (let i = 0; i < count; i++) {
    const r = 16 + i * 15.5
    const circumference = 2 * Math.PI * r
    // Roughly even weave cells per ring, so the pattern stays proportional
    // as the rings grow rather than stretching out at the edge.
    const cells = Math.max(8, Math.round(circumference / 26))
    const cell = circumference / cells
    const thick = i % 2 === 0
    out.push({
      r,
      w: thick ? 3.4 : 1.1,
      dash: thick ? `${cell * 0.56} ${cell * 0.44}` : `${cell * 0.3} ${cell * 0.7}`,
      offset: (i % 2 === 0 ? 0 : cell * 0.5) + i * 2.5,
    })
  }
  return out
}

export function Mesob({
  className = '',
  count = 12,
}: {
  className?: string
  count?: number
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <g fill="none" stroke="currentColor" strokeLinecap="butt">
        {rings(count).map((ring) => (
          <circle
            key={ring.r}
            cx="200"
            cy="200"
            r={ring.r}
            strokeWidth={ring.w}
            strokeDasharray={ring.dash}
            strokeDashoffset={ring.offset}
          />
        ))}
        <circle cx="200" cy="200" r="6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  )
}

/** Small solid mark for section headings and the favicon. */
export function MesobMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="10.2" strokeDasharray="3.6 2.6" />
        <circle cx="12" cy="12" r="6.2" strokeDasharray="2.4 2.4" strokeDashoffset="1.2" />
      </g>
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
    </svg>
  )
}
