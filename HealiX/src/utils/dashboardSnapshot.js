import { messages as seedMessages } from '../data/dummyData'
import { enrichDoctors } from '../data/bookingData'
import { enrichProducts } from '../data/pharmacyData'
import { loadAppointments } from './bookingStorage'
import { extractMedicationsFromAppointment } from './clinicalNotes'
import { loadDoctorThreads } from './messageThreadsStorage'
import { loadMedChecksForToday, loadTasks } from './personalHealthStorage'
import { loadPharmacyOrders } from './pharmacyStorage'
import { loadPharmacyThreads } from './pharmacyThreadsStorage'
import { loadLatestPrescriptionScan } from './prescriptionScanStorage'

function dedupeMedications(apts) {
  const map = new Map()
  apts.forEach((apt) => {
    extractMedicationsFromAppointment(apt).forEach((m) => {
      const k = `${m.name}|${m.timing}|${m.appointmentId}`
      if (!map.has(k)) map.set(k, m)
    })
  })
  return [...map.values()]
}

export function computeHealthSummary() {
  const tasks = loadTasks()
  const medChecks = loadMedChecksForToday()
  const apts = loadAppointments().filter((a) => a.status !== 'Cancelled')
  const medications = dedupeMedications(apts)

  const taskDone = tasks.filter((t) => t.completed).length
  const taskTotal = tasks.length || 1
  const medTaken = medications.filter((m) => medChecks[m.id]).length
  const medTotal = medications.length || 1

  const healthScore = Math.min(
    100,
    Math.round((taskDone / taskTotal) * 50 + (medications.length ? (medTaken / medTotal) * 50 : 25)),
  )

  let summaryMessage = 'Your health is stable — you are doing well.'
  if (healthScore < 70 && healthScore >= 45) {
    summaryMessage = "You're doing fine — a few habits or doses could use attention."
  } else if (healthScore < 45) {
    summaryMessage = 'Focus on medications and daily habits when you can — small steps help.'
  }

  return { healthScore, summaryMessage }
}

function sortUpcoming(list) {
  return [...list].sort((a, b) => {
    const da = `${a.date || ''} ${a.time || ''}`
    const db = `${b.date || ''} ${b.time || ''}`
    return da.localeCompare(db)
  })
}

export function getUpcomingAppointments() {
  return sortUpcoming(loadAppointments().filter((a) => a.status === 'Upcoming'))
}

export function getTodayMedications() {
  const apts = loadAppointments().filter((a) => a.status !== 'Cancelled')
  const meds = dedupeMedications(apts)
  const medChecks = loadMedChecksForToday()
  return meds.map((m) => ({
    ...m,
    taken: Boolean(medChecks[m.id]),
  }))
}

function lastSearchQuery() {
  try {
    return (sessionStorage.getItem('healix_last_search_query') || '').toLowerCase()
  } catch {
    return ''
  }
}

export function getRecommendedDoctorCards() {
  const q = lastSearchQuery()
  let pool = enrichDoctors()
  if (q.includes('skin') || q.includes('hair') || q.includes('derma')) {
    pool = pool.filter((d) => /derma/i.test(d.specialization))
  } else if (q.includes('heart') || q.includes('chest') || q.includes('cardio')) {
    pool = pool.filter((d) => /cardio/i.test(d.specialization))
  } else if (q.includes('head') || q.includes('brain') || q.includes('neuro')) {
    pool = pool.filter((d) => /neuro/i.test(d.specialization) || /general medicine/i.test(d.specialization))
  } else if (q.includes('ent') || q.includes('throat') || q.includes('cold')) {
    pool = pool.filter((d) => /ent/i.test(d.specialization) || /general medicine/i.test(d.specialization))
  }
  if (pool.length === 0) pool = enrichDoctors()

  return pool.slice(0, 4).map((d) => ({
    id: d.id,
    doctorName: d.name,
    specialty: d.specialization,
    rating: Number(d.rating || 4.5).toFixed(1),
    hospitalName: d.hospitalName,
    image: d.hospitalImage || d.image,
  }))
}

export const testPackagesStatic = [
  { id: 'pkg-full', title: 'Full Body Checkup', price: 2499, offer: '20% OFF', filterTags: ['checkup', 'lab', 'full body'] },
  { id: 'pkg-dia', title: 'Diabetes Package', price: 1299, offer: '15% OFF', filterTags: ['diabetes', 'checkup', 'lab'] },
  { id: 'pkg-heart', title: 'Heart Screening', price: 1899, offer: '10% OFF', filterTags: ['cardiac', 'heart', 'checkup'] },
]

export function getPharmacyDealCards() {
  const orders = loadPharmacyOrders()
  const recent = orders.slice(0, 2).map((o) => ({
    id: `ord-${o.id}`,
    title: o.productName || 'Recent order',
    subtitle: `Status: ${o.status}`,
    offer: o.status === 'Delivered' ? 'Reorder' : 'Track',
    kind: 'order',
    orderId: o.id,
  }))
  const combos = [
    { id: 'combo-1', title: 'Immunity combo kit', subtitle: 'Vitamin C + Zinc', offer: '18% OFF', kind: 'combo' },
    { id: 'combo-2', title: 'Pain relief pack', subtitle: 'Paracetamol + Balm', offer: '12% OFF', kind: 'combo' },
  ]
  const fromCatalog = enrichProducts().slice(0, 2).map((p) => ({
    id: `med-${p.id}`,
    title: p.name,
    subtitle: p.category,
    offer: p.availability === 'Low Stock' ? 'Restock soon' : 'Deals',
    kind: 'product',
    productId: p.id,
  }))
  return [...recent, ...combos, ...fromCatalog].slice(0, 5)
}

function threadPreviewName(t, kind) {
  if (kind === 'doctor') return t.doctorName
  if (kind === 'pharmacy') return t.storeName
  return 'Chat'
}

export function getRecentMessageRows() {
  const rows = []

  loadDoctorThreads().forEach((t) => {
    if (rows.length >= 2) return
    const last = t.messages?.[t.messages.length - 1]
    if (last) {
      rows.push({
        id: `d-${t.doctorId}`,
        name: threadPreviewName(t, 'doctor'),
        preview: last.text,
        kind: 'doctor',
        doctorId: t.doctorId,
        hospital: t.hospital || '',
      })
    }
  })

  loadPharmacyThreads().forEach((t) => {
    if (rows.length >= 2) return
    const last = t.messages?.[t.messages.length - 1]
    if (last) {
      rows.push({
        id: `p-${t.storeId}`,
        name: threadPreviewName(t, 'pharmacy'),
        preview: last.text,
        kind: 'pharmacy',
        storeId: t.storeId,
        storeName: t.storeName,
        address: t.address || '',
      })
    }
  })

  for (const m of seedMessages) {
    if (rows.length >= 2) break
    rows.push({
      id: `seed-${m.id}`,
      name: m.from,
      preview: m.text,
      kind: 'support',
    })
  }

  return rows.slice(0, 2)
}

export function buildDashboardSnapshot() {
  return {
    health: computeHealthSummary(),
    upcoming: getUpcomingAppointments(),
    medications: getTodayMedications(),
    doctors: getRecommendedDoctorCards(),
    testPackages: testPackagesStatic,
    pharmacyDeals: getPharmacyDealCards(),
    messages: getRecentMessageRows(),
    latestPrescriptionScan: loadLatestPrescriptionScan(),
  }
}
