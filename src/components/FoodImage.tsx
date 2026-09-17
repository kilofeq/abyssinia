import sizes from '../content/food-sizes.json'

export function FoodImage({ id, alt = '', className = '', eager = false }: {
  id: string; alt?: string; className?: string; eager?: boolean
}) {
  const size = sizes[id as keyof typeof sizes]
  if (!size) return null
  return <picture className="contents">
    <source type="image/avif" srcSet={`/food/${id}.avif`} />
    <img src={`/food/${id}.webp`} alt={alt} width={size.width} height={size.height}
    loading={eager ? 'eager' : 'lazy'} decoding="async" className={className} />
  </picture>
}
