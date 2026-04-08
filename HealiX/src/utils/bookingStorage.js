export const APPOINTMENTS_KEY = 'healix_user_appointments'
export const BOOKMARKS_KEY = 'healix_booking_bookmarks'
export const APPOINTMENTS_EVENT = 'healix-appointments-changed'

export function loadAppointments() {
  try {
    return JSON.parse(localStorage.getItem(APPOINTMENTS_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveAppointments(list) {
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(list))
  window.dispatchEvent(new CustomEvent(APPOINTMENTS_EVENT))
}

export function loadBookmarks() {
  try {
    const raw = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]')
    if (!Array.isArray(raw)) return []
    return [...new Set(raw.map((x) => Number(x)).filter((n) => Number.isFinite(n)))]
  } catch {
    return []
  }
}

export function saveBookmarks(ids) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids))
  window.dispatchEvent(new CustomEvent('healix-bookmarks-changed'))
}

export function isBookmarked(doctorId, bookmarks) {
  return bookmarks.includes(doctorId)
}

export function toggleBookmark(doctorId) {
  const current = loadBookmarks()
  const next = current.includes(doctorId) ? current.filter((id) => id !== doctorId) : [...current, doctorId]
  saveBookmarks(next)
  return next
}
