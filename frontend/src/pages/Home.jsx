import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/ui/Button'
import { APPOINTMENTS_EVENT } from '../utils/bookingStorage'
import { buildDashboardSnapshot } from '../utils/dashboardSnapshot'
import { PERSONAL_HEALTH_EVENT, setMedChecked } from '../utils/personalHealthStorage'
import { PHARMACY_ORDERS_EVENT } from '../utils/pharmacyStorage'
import { HEALTH_IMAGE_FALLBACK, HEALTH_IMG_CLASS, onHealthImageError } from '../utils/healthMediaFallback'

const SYNC_EVENTS = [
  APPOINTMENTS_EVENT,
  PERSONAL_HEALTH_EVENT,
  PHARMACY_ORDERS_EVENT,
  'healix-doctor-threads-changed',
  'healix-pharmacy-threads-changed',
  'healix-user-profile-changed',
]

const cardHover = 'cursor-pointer transition duration-200 hover:scale-[1.02] active:scale-[0.99]'

function greetingFromHour(h) {
  if (h >= 5 && h < 12) return 'Good Morning!!!'
  if (h >= 12 && h < 17) return 'Good Afternoon!!!'
  if (h >= 17 && h < 21) return 'Good Evening!!!'
  return 'Good Night!!!'
}

function Home() {
  const navigate = useNavigate()
  const [rev, setRev] = useState(0)
  const [greetingTitle, setGreetingTitle] = useState(() => greetingFromHour(new Date().getHours()))

  const bump = useCallback(() => setRev((r) => r + 1), [])

  useEffect(() => {
    SYNC_EVENTS.forEach((e) => window.addEventListener(e, bump))
    return () => SYNC_EVENTS.forEach((e) => window.removeEventListener(e, bump))
  }, [bump])

  const data = useMemo(() => {
    void rev
    return buildDashboardSnapshot()
  }, [rev])

  useEffect(() => {
    const tick = () => setGreetingTitle(greetingFromHour(new Date().getHours()))
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  const onMedTaken = (e, id) => {
    e.stopPropagation()
    setMedChecked(id, true)
  }

  const goMessages = (m) => {
    if (m.kind === 'doctor' && m.doctorId != null) {
      navigate('/messages', {
        state: {
          openDoctorChat: { doctorId: m.doctorId, name: m.name, hospital: m.hospital || '' },
        },
      })
      return
    }
    if (m.kind === 'pharmacy' && m.storeId != null) {
      navigate('/messages', {
        state: {
          openPharmacyChat: {
            storeId: m.storeId,
            storeName: m.storeName,
            address: m.address || '',
          },
        },
      })
      return
    }
    navigate('/messages')
  }

  const goPharmacyDeal = (deal) => {
    if (deal.kind === 'order' && deal.orderId != null) {
      navigate(`/pharmacy/order/${deal.orderId}`)
      return
    }
    if (deal.kind === 'product' && deal.productId != null) {
      navigate('/pharmacy', { state: { orderProductId: deal.productId } })
      return
    }
    navigate('/pharmacy')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={greetingTitle}
        subtitle="Your health dashboard — synced with Booking, Pharmacy, Messages, and Personal Health."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section
          role="button"
          tabIndex={0}
          onClick={() => navigate('/personal-health')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/personal-health')}
          className={`rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700 lg:col-span-3 ${cardHover}`}
        >
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Health summary</h2>
          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">
                {data.health.healthScore}
                <span className="text-lg font-medium text-slate-500">/100</span>
              </p>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {data.health.summaryMessage}
            </p>
          </div>
        </section>

        <section
          role="button"
          tabIndex={0}
          onClick={() => navigate('/personal-health')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/personal-health')}
          className={`rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700 lg:col-span-3 ${cardHover}`}
        >
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Latest prescription scan</h2>
          {data.latestPrescriptionScan ? (
            <div className="mt-3">
              <p className="text-xs text-slate-500">
                {new Date(data.latestPrescriptionScan.createdAt).toLocaleString()} · {data.latestPrescriptionScan.fileName}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{data.latestPrescriptionScan.summary}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">No scanned prescription yet. Add one in Personal Health.</p>
          )}
        </section>

        <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Upcoming appointments</h2>
          <div className="mt-3 space-y-3">
            {data.upcoming.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming appointments</p>
            ) : (
              data.upcoming.map((a) => (
                <div
                  key={a.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/booking/appointment/${a.id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/booking/appointment/${a.id}`)}
                  className={`flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between ${cardHover}`}
                >
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{a.doctor}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {a.date} · {a.time}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {a.mode === 'Online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                    {a.mode === 'Online' ? (
                      <Button type="button" variant="secondary" className="text-xs" onClick={() => window.alert('Joining video call (mock)…')}>
                        Join call
                      </Button>
                    ) : null}
                    <Button type="button" className="text-xs" onClick={() => navigate(`/booking/appointment/${a.id}`)}>
                      View details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Medicine reminders</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">From your visit prescriptions (today)</p>
          <ul className="mt-3 space-y-2">
            {data.medications.length === 0 ? (
              <li className="text-sm text-slate-500">No active prescriptions — book a visit to sync meds.</li>
            ) : (
              data.medications.map((m) => (
                <li
                  key={m.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate('/personal-health')}
                  onKeyDown={(e) => e.key === 'Enter' && navigate('/personal-health')}
                  className={`flex flex-col gap-2 rounded-xl border border-slate-100 p-3 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between ${cardHover}`}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.timing}</p>
                    <p className="mt-1 text-xs text-slate-500">{m.taken ? 'Taken' : 'Pending'}</p>
                  </div>
                  {!m.taken ? (
                    <Button type="button" variant="secondary" className="shrink-0 text-xs" onClick={(e) => onMedTaken(e, m.id)}>
                      Mark as taken
                    </Button>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700 lg:col-span-3">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Recommended hospitals & doctors</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Based on your recent search terms and health activity</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.doctors.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => navigate(`/booking/doctor/${d.id}`)}
                className={`rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-left shadow-sm dark:border-slate-700 dark:bg-slate-800/40 ${cardHover}`}
              >
                <div className="mb-3 h-40 w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={d.image || HEALTH_IMAGE_FALLBACK}
                    alt=""
                    className={HEALTH_IMG_CLASS}
                    onError={onHealthImageError}
                  />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{d.doctorName}</p>
                <p className="text-xs text-slate-500">{d.specialty}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{d.hospitalName}</p>
                <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">★ {d.rating}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Popular test packages</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {data.testPackages.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => navigate('/booking', { state: { activeCategoryTags: pkg.filterTags || [] } })}
                className={`rounded-xl border border-slate-100 bg-gradient-to-br from-blue-50 to-white p-4 text-left shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 ${cardHover}`}
              >
                <span className="inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">
                  {pkg.offer}
                </span>
                <p className="mt-2 font-medium text-slate-800 dark:text-slate-100">{pkg.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">₹{pkg.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Offers & pharmacy deals</h2>
          <ul className="mt-3 space-y-2">
            {data.pharmacyDeals.map((deal) => (
              <li key={deal.id}>
                <button
                  type="button"
                  onClick={() => goPharmacyDeal(deal)}
                  className={`w-full rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 text-left text-sm dark:border-slate-700 dark:bg-slate-800/50 ${cardHover}`}
                >
                  <span className="font-medium text-slate-800 dark:text-slate-100">{deal.title}</span>
                  {deal.subtitle ? <span className="block text-xs text-slate-500">{deal.subtitle}</span> : null}
                  <span className="mt-1 inline-block text-xs font-semibold text-emerald-700 dark:text-emerald-300">{deal.offer}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700 lg:col-span-3">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Recent messages</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {data.messages.length === 0 ? (
              <p className="text-sm text-slate-500">No recent conversations.</p>
            ) : (
              data.messages.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => goMessages(m)}
                  className={`rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-left text-sm shadow-sm dark:border-slate-700 dark:bg-slate-800/50 ${cardHover}`}
                >
                  <p className="font-medium text-slate-800 dark:text-slate-100">{m.name}</p>
                  <p className="mt-1 line-clamp-2 text-slate-600 dark:text-slate-300">{m.preview}</p>
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
