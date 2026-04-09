const KEY = 'healix_doctor_message_threads_v1'

export function loadDoctorThreads() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveDoctorThreads(threads) {
  localStorage.setItem(KEY, JSON.stringify(threads))
  window.dispatchEvent(new CustomEvent('healix-doctor-threads-changed'))
}

export function ensureDoctorThread(doctorId, doctorName, hospital, welcomeText) {
  const list = loadDoctorThreads()
  let idx = list.findIndex((t) => t.doctorId === doctorId)
  if (idx < 0) {
    list.push({
      doctorId,
      doctorName,
      hospital: hospital || '',
      messages: welcomeText
        ? [{ id: Date.now(), from: 'doctor', text: welcomeText, time: 'Now' }]
        : [],
    })
    idx = list.length - 1
  } else if (welcomeText && list[idx].messages.length === 0) {
    list[idx].messages.push({ id: Date.now(), from: 'doctor', text: welcomeText, time: 'Now' })
  }
  saveDoctorThreads(list)
  return list[idx]
}

export function appendToThread(doctorId, message) {
  const list = loadDoctorThreads()
  const idx = list.findIndex((t) => t.doctorId === doctorId)
  if (idx < 0) return
  list[idx].messages.push(message)
  saveDoctorThreads(list)
}
