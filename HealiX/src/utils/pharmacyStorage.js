export const PHARMACY_ORDERS_KEY = 'healix_pharmacy_orders_v1'
export const PHARMACY_BOOKMARKS_KEY = 'healix_pharmacy_product_bookmarks'
export const PHARMACY_ORDERS_EVENT = 'healix-pharmacy-orders-changed'
export const PHARMACY_REMINDERS_KEY = 'healix_pharmacy_delivery_reminders'

export function loadPharmacyOrders() {
  try {
    return JSON.parse(localStorage.getItem(PHARMACY_ORDERS_KEY) || '[]')
  } catch {
    return []
  }
}

export function savePharmacyOrders(orders) {
  localStorage.setItem(PHARMACY_ORDERS_KEY, JSON.stringify(orders))
  window.dispatchEvent(new CustomEvent(PHARMACY_ORDERS_EVENT))
}

export function loadPharmacyBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(PHARMACY_BOOKMARKS_KEY) || '[]')
  } catch {
    return []
  }
}

export function savePharmacyBookmarks(ids) {
  localStorage.setItem(PHARMACY_BOOKMARKS_KEY, JSON.stringify(ids))
  window.dispatchEvent(new CustomEvent('healix-pharmacy-bookmarks-changed'))
}

export function togglePharmacyBookmark(productId) {
  const cur = loadPharmacyBookmarks()
  const next = cur.includes(productId) ? cur.filter((id) => id !== productId) : [...cur, productId]
  savePharmacyBookmarks(next)
  return next
}

export function addDeliveryReminder(orderId, note) {
  const raw = JSON.parse(localStorage.getItem(PHARMACY_REMINDERS_KEY) || '[]')
  raw.push({ id: `rem-${Date.now()}`, orderId, note, at: new Date().toISOString() })
  localStorage.setItem(PHARMACY_REMINDERS_KEY, JSON.stringify(raw))
}
