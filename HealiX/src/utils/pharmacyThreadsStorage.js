const KEY = 'healix_pharmacy_store_threads_v1'

/** Normalize legacy `from` → `sender` for persistence contract */
export function normalizePharmacyMessage(msg) {
  const sender =
    msg.sender ??
    (msg.from === 'user' ? 'user' : msg.from === 'store' ? 'store' : 'store')
  return {
    id: msg.id,
    sender,
    text: msg.text,
    time: msg.time ?? 'Now',
  }
}

function migrateThreads(rawThreads) {
  let changed = false
  const threads = rawThreads.map((t) => ({
    ...t,
    messages: (t.messages || []).map((m) => {
      const next = normalizePharmacyMessage(m)
      if (m.from !== undefined || !m.sender) changed = true
      return next
    }),
  }))
  return { threads, changed }
}

export function loadPharmacyThreads() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const { threads, changed } = migrateThreads(parsed)
    if (changed) savePharmacyThreads(threads)
    return threads
  } catch {
    return []
  }
}

export function savePharmacyThreads(threads) {
  localStorage.setItem(KEY, JSON.stringify(threads))
  window.dispatchEvent(new CustomEvent('healix-pharmacy-threads-changed'))
}

export function ensurePharmacyThread(storeId, storeName, address, welcomeText) {
  const list = loadPharmacyThreads()
  let idx = list.findIndex((t) => t.storeId === storeId)
  if (idx < 0) {
    list.push({
      storeId,
      storeName,
      address: address || '',
      messages: welcomeText
        ? [{ id: Date.now(), sender: 'store', text: welcomeText, time: 'Now' }]
        : [],
    })
    idx = list.length - 1
  } else if (welcomeText && list[idx].messages.length === 0) {
    list[idx].messages.push({
      id: Date.now(),
      sender: 'store',
      text: welcomeText,
      time: 'Now',
    })
  }
  savePharmacyThreads(list)
  return list[idx]
}

export function appendPharmacyThreadMessage(storeId, message) {
  const list = loadPharmacyThreads()
  const idx = list.findIndex((t) => t.storeId === storeId)
  if (idx < 0) return
  const row = normalizePharmacyMessage(message)
  list[idx].messages.push(row)
  savePharmacyThreads(list)
}
