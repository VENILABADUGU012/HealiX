const KEY = 'healix_app_inbox_v1'
export const APP_INBOX_EVENT = 'healix-app-inbox-changed'

export function loadAppInbox() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const p = JSON.parse(raw)
    return Array.isArray(p) ? p : []
  } catch {
    return []
  }
}

export function saveAppInbox(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new CustomEvent(APP_INBOX_EVENT))
}

export function prependAppInboxItem(item) {
  const cur = loadAppInbox()
  const next = [item, ...cur].slice(0, 80)
  saveAppInbox(next)
  return next
}
