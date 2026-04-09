export const HEALTH_IMAGE_FALLBACK = 'https://placehold.co/300x200?text=Health'

/** Standard fill for images inside fixed-size wrappers (Booking + Pharmacy). */
export const HEALTH_IMG_CLASS = 'w-full h-full object-cover rounded-lg'

export function onHealthImageError(e) {
  e.currentTarget.onerror = null
  e.currentTarget.src = HEALTH_IMAGE_FALLBACK
}
