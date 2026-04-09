const SCAN_KEY = 'healix_prescription_scans_v1'
export const PRESCRIPTION_SCAN_EVENT = 'healix-prescription-scan-changed'

export function loadPrescriptionScans() {
  try {
    const raw = JSON.parse(localStorage.getItem(SCAN_KEY) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export function savePrescriptionScan(scan) {
  const list = loadPrescriptionScans()
  const next = [{ ...scan, id: `scan-${Date.now()}`, createdAt: new Date().toISOString() }, ...list].slice(0, 50)
  localStorage.setItem(SCAN_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(PRESCRIPTION_SCAN_EVENT))
  return next[0]
}

export function loadLatestPrescriptionScan() {
  return loadPrescriptionScans()[0] || null
}
