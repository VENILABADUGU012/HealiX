import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { recommendationSlides, enrichDoctors } from '../data/bookingData'
import { HEALTH_IMAGE_FALLBACK, HEALTH_IMG_CLASS, onHealthImageError } from '../utils/healthMediaFallback'
import { APPOINTMENTS_EVENT, loadAppointments, loadBookmarks, saveAppointments, saveBookmarks } from '../utils/bookingStorage'

function Booking() {
  const navigate = useNavigate()
  const location = useLocation()
  const doctors = useMemo(() => enrichDoctors(), [])
  const carouselRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategoryTags, setActiveCategoryTags] = useState([])
  const [bookmarks, setBookmarks] = useState(() => loadBookmarks())
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterMode, setFilterMode] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [appointments, setAppointments] = useState(() => loadAppointments())

  const [bookingDoctor, setBookingDoctor] = useState(null)
  const [bookingStep, setBookingStep] = useState(1)
  const [visitMode, setVisitMode] = useState('Online')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [notes, setNotes] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)

  const [videoAppt, setVideoAppt] = useState(null)
  const [rescheduleAppt, setRescheduleAppt] = useState(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')

  const refreshAppointments = useCallback(() => setAppointments(loadAppointments()), [])
  const refreshBookmarks = useCallback(() => setBookmarks(loadBookmarks()), [])

  useEffect(() => {
    const onApt = () => refreshAppointments()
    const onBm = () => refreshBookmarks()
    window.addEventListener(APPOINTMENTS_EVENT, onApt)
    window.addEventListener('healix-bookmarks-changed', onBm)
    return () => {
      window.removeEventListener(APPOINTMENTS_EVENT, onApt)
      window.removeEventListener('healix-bookmarks-changed', onBm)
    }
  }, [refreshAppointments, refreshBookmarks])

  /* Router state → booking filters / modal (intentional sync) */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const st = location.state
    if (!st) return
    let applied = false
    if (st.activeCategoryTags?.length) {
      setActiveCategoryTags(st.activeCategoryTags)
      applied = true
    }
    if (st.bookDoctorId != null) {
      const bid = parseInt(String(st.bookDoctorId), 10)
      const d = Number.isFinite(bid) ? doctors.find((x) => x.id === bid) : undefined
      if (d) {
        setBookingDoctor(d)
        setBookingStep(1)
        setVisitMode(d.mode === 'Offline' ? 'Offline' : d.mode === 'Online' ? 'Online' : 'Online')
        applied = true
      }
    }
    if (applied) navigate(location.pathname, { replace: true, state: {} })
  }, [location.state, doctors, navigate, location.pathname])
  /* eslint-enable react-hooks/set-state-in-effect */

  const scrollCarousel = (dir) => {
    const el = carouselRef.current
    if (!el) return
    el.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  const onRecommendClick = (slide) => {
    navigate(`/booking/recommendations/${slide.id}`)
  }

  const filteredDoctors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const matchesCategory = (d) => {
      if (!activeCategoryTags.length) return true
      const blob = `${d.specialization} ${d.hospitalName} ${d.diseases.join(' ')}`.toLowerCase()
      return activeCategoryTags.some((tag) => blob.includes(tag.toLowerCase()))
    }
    const matchesSearch = (d) => {
      if (!q) return true
      return (
        d.name.toLowerCase().includes(q) ||
        d.hospitalName.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.diseases.some((dis) => dis.toLowerCase().includes(q))
      )
    }
    const matchesModeFilter = (d) => {
      if (filterMode === 'all') return true
      if (filterMode === 'Online') return d.mode === 'Online' || d.mode === 'Both'
      if (filterMode === 'Offline') return d.mode === 'Offline' || d.mode === 'Both'
      return true
    }

    let list = doctors.filter((d) => matchesCategory(d) && matchesSearch(d) && matchesModeFilter(d))
    if (showBookmarksOnly) {
      list = list.filter((d) => bookmarks.includes(d.id))
    }
    list = [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'fee') return a.fee - b.fee
      return a.name.localeCompare(b.name)
    })
    return list
  }, [doctors, activeCategoryTags, searchQuery, filterMode, showBookmarksOnly, bookmarks, sortBy])

  const toggleBookmark = (doctorId) => {
    const current = loadBookmarks()
    const next = current.includes(doctorId) ? current.filter((id) => id !== doctorId) : [...current, doctorId]
    saveBookmarks(next)
    setBookmarks(next)
  }

  const openBook = (d) => {
    setBookingDoctor(d)
    setBookingStep(1)
    setVisitMode(d.mode === 'Offline' ? 'Offline' : 'Online')
    setBookingDate('')
    setBookingTime('')
    setSymptoms('')
    setNotes('')
  }

  const slotsForBooking = () => {
    if (!bookingDoctor) return []
    if (visitMode === 'Online') return bookingDoctor.slotsOnline.length ? bookingDoctor.slotsOnline : bookingDoctor.slotsOffline
    return bookingDoctor.slotsOffline.length ? bookingDoctor.slotsOffline : bookingDoctor.slotsOnline
  }

  const confirmPayment = () => {
    if (!bookingDoctor || !bookingDate || !bookingTime) return
    const next = [
      ...loadAppointments(),
      {
        id: `apt-${Date.now()}`,
        doctorId: bookingDoctor.id,
        doctor: bookingDoctor.name,
        hospitalId: bookingDoctor.hospitalId,
        hospital: bookingDoctor.hospitalName,
        date: bookingDate,
        time: bookingTime,
        mode: visitMode === 'Online' ? 'Online' : 'Offline',
        status: 'Upcoming',
        specialty: bookingDoctor.specialization,
        fee: bookingDoctor.fee,
        symptoms,
        notes,
        hasRescheduled: false,
      },
    ]
    saveAppointments(next)
    setAppointments(next)
    setBookingDoctor(null)
    setBookingStep(1)
    setSuccessOpen(true)
  }

  const cancelAppointment = (id) => {
    const next = loadAppointments().map((a) => (a.id === id ? { ...a, status: 'Cancelled' } : a))
    saveAppointments(next)
    setAppointments(next)
  }

  const completeAppointment = (id) => {
    const next = loadAppointments().map((a) => (a.id === id ? { ...a, status: 'Completed' } : a))
    saveAppointments(next)
    setAppointments(next)
  }

  const applyReschedule = () => {
    if (!rescheduleAppt || !rescheduleDate || !rescheduleTime) return
    const next = loadAppointments().map((a) =>
      a.id === rescheduleAppt.id ? { ...a, date: rescheduleDate, time: rescheduleTime, hasRescheduled: true } : a,
    )
    saveAppointments(next)
    setAppointments(next)
    setRescheduleAppt(null)
  }

  const messageDoctor = (name, hospital, doctorId) => {
    navigate('/messages', {
      state: { openDoctorChat: { name, hospital, doctorId } },
    })
  }

  const upcomingList = appointments.filter((a) => a.status === 'Upcoming')

  return (
    <div className="space-y-6">
      <PageHeader title="Booking" subtitle="Discover care, book visits, and stay connected." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Recommendations" className="overflow-hidden">
          <div className="relative">
            <button
              type="button"
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:shadow-xl"
              onClick={() => scrollCarousel(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:shadow-xl"
              onClick={() => scrollCarousel(1)}
            >
              ›
            </button>
            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {recommendationSlides.map((slide) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => onRecommendClick(slide)}
                  className="min-w-[240px] max-w-[260px] shrink-0 rounded-xl border border-slate-200 bg-white text-left shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  <div className="h-40 overflow-hidden rounded-t-xl bg-gray-100">
                    <img
                      src={slide.image || HEALTH_IMAGE_FALLBACK}
                      alt=""
                      className={HEALTH_IMG_CLASS}
                      onError={onHealthImageError}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-slate-800">{slide.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{slide.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {activeCategoryTags.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              Filtered: {activeCategoryTags.join(', ')}
              <button type="button" className="ml-2 text-blue-600 underline" onClick={() => setActiveCategoryTags([])}>
                Clear
              </button>
            </p>
          )}
        </Card>

        <Card
          title="Your appointments"
          action={
            <Button variant="outline" onClick={() => navigate('/booking/history')}>
              View History
            </Button>
          }
        >
          <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {upcomingList.length === 0 ? (
              <p className="text-sm text-slate-500">No upcoming visits. Book below.</p>
            ) : (
              upcomingList.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl border border-slate-200 p-3 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-800">{a.doctor}</p>
                      <p className="text-sm text-slate-600">{a.hospital}</p>
                      <p className="text-sm text-slate-500">
                        {a.date} · {a.time}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge tone={a.mode === 'Online' ? 'info' : 'default'}>{a.mode}</Badge>
                      <Badge tone="success">{a.status}</Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => navigate(`/booking/appointment/${a.id}`)}>
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      disabled={a.hasRescheduled}
                      onClick={() => {
                        setRescheduleAppt(a)
                        setRescheduleDate(a.date)
                        setRescheduleTime(a.time)
                      }}
                    >
                      {a.hasRescheduled ? 'Rescheduled' : 'Reschedule'}
                    </Button>
                    <Button variant="outline" onClick={() => cancelAppointment(a.id)}>
                      Cancel
                    </Button>
                    {a.mode === 'Online' && (
                      <>
                        <Button variant="secondary" onClick={() => setVideoAppt(a)}>
                          Join Call
                        </Button>
                        <Button variant="secondary" onClick={() => messageDoctor(a.doctor, a.hospital, a.doctorId)}>
                          Message Doctor
                        </Button>
                      </>
                    )}
                    <Button variant="outline" onClick={() => completeAppointment(a.id)}>
                      Mark completed
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="search"
            placeholder="Search hospital, doctor, disease, specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setFilterOpen(true)}>
              Filter
            </Button>
            <Button
              variant={showBookmarksOnly ? 'primary' : 'secondary'}
              onClick={() => setShowBookmarksOnly((v) => !v)}
            >
              {showBookmarksOnly ? 'All results' : `Bookmarks (${bookmarks.length})`}
            </Button>
          </div>
        </div>
      </Card>

      <div>
        <p className="mb-3 text-sm font-medium text-slate-700">{filteredDoctors.length} providers</p>
        <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
          {filteredDoctors.map((d) => (
            <div
              key={d.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-md transition-all duration-300 hover:shadow-xl sm:flex-row"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-40 sm:w-36">
                <img
                  src={d.hospitalImage || d.image || HEALTH_IMAGE_FALLBACK}
                  alt=""
                  className={HEALTH_IMG_CLASS}
                  onError={onHealthImageError}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{d.name}</p>
                    <p className="text-sm text-slate-600">{d.specialization}</p>
                    <p className="text-sm text-slate-500">{d.hospitalName}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Bookmark"
                    className={`text-xl transition ${bookmarks.includes(d.id) ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'}`}
                    onClick={() => toggleBookmark(d.id)}
                  >
                    ♥
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-amber-600">★ {d.rating}</span>
                  <span className="text-slate-500">({d.reviewCount} reviews)</span>
                  <Badge tone={d.mode === 'Online' ? 'info' : d.mode === 'Offline' ? 'default' : 'success'}>
                    {d.mode === 'Both' ? 'Online / Offline' : d.mode}
                  </Badge>
                  <span className="font-medium text-slate-800">₹{d.fee}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="secondary" onClick={() => navigate(`/booking/doctor/${d.id}`)}>
                    View Details
                  </Button>
                  <Button onClick={() => openBook(d)}>Book</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={filterOpen} title="Filters" onClose={() => setFilterOpen(false)}>
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Availability</p>
          <div className="flex gap-2">
            {['all', 'Online', 'Offline'].map((m) => (
              <Button key={m} variant={filterMode === m ? 'primary' : 'secondary'} onClick={() => setFilterMode(m)}>
                {m === 'all' ? 'All' : m}
              </Button>
            ))}
          </div>
          <p className="text-sm font-medium text-slate-700">Sort by</p>
          <select
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Rating</option>
            <option value="fee">Fee (low to high)</option>
            <option value="name">Name</option>
          </select>
          <Button className="w-full" onClick={() => setFilterOpen(false)}>
            Apply
          </Button>
        </div>
      </Modal>

      <Modal open={Boolean(bookingDoctor)} title="Book appointment" onClose={() => setBookingDoctor(null)}>
        {bookingDoctor && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              {bookingDoctor.name} · {bookingDoctor.hospitalName}
            </p>
            {bookingStep === 1 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Select mode</p>
                <div className="flex gap-2">
                  {(bookingDoctor.mode === 'Online' || bookingDoctor.mode === 'Both') && (
                    <Button variant={visitMode === 'Online' ? 'primary' : 'secondary'} onClick={() => setVisitMode('Online')}>
                      Online (Video)
                    </Button>
                  )}
                  {(bookingDoctor.mode === 'Offline' || bookingDoctor.mode === 'Both') && (
                    <Button variant={visitMode === 'Offline' ? 'primary' : 'secondary'} onClick={() => setVisitMode('Offline')}>
                      Offline (Visit)
                    </Button>
                  )}
                </div>
                <Button className="w-full" onClick={() => setBookingStep(2)}>
                  Continue
                </Button>
              </div>
            )}
            {bookingStep === 2 && (
              <div className="space-y-2">
                <Input label="Date" type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                <p className="text-sm font-medium">Time slot</p>
                <div className="flex flex-wrap gap-2">
                  {slotsForBooking().map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`rounded-lg px-3 py-1 text-xs transition ${bookingTime === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                      onClick={() => setBookingTime(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setBookingStep(1)}>
                    Back
                  </Button>
                  <Button className="flex-1" disabled={!bookingDate || !bookingTime} onClick={() => setBookingStep(3)}>
                    Next
                  </Button>
                </div>
              </div>
            )}
            {bookingStep === 3 && (
              <div className="space-y-2">
                <Input label="Symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-700">Notes</span>
                  <textarea
                    className="min-h-20 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setBookingStep(2)}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setBookingStep(4)}>
                    Continue to payment
                  </Button>
                </div>
              </div>
            )}
            {bookingStep === 4 && (
              <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                <p>
                  <strong>Doctor:</strong> {bookingDoctor.name}
                </p>
                <p>
                  <strong>Hospital:</strong> {bookingDoctor.hospitalName}
                </p>
                <p>
                  <strong>When:</strong> {bookingDate} {bookingTime}
                </p>
                <p>
                  <strong>Mode:</strong> {visitMode}
                </p>
                <p className="text-lg font-semibold text-slate-800">₹{bookingDoctor.fee}</p>
                <Button className="w-full" onClick={confirmPayment}>
                  Pay & Confirm
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setBookingStep(3)}>
                  Back
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal open={successOpen} title="Booking confirmed" onClose={() => setSuccessOpen(false)}>
        <p className="text-sm text-slate-600">Your appointment is saved. You can manage it in the widget above.</p>
        <Button className="mt-3 w-full" onClick={() => setSuccessOpen(false)}>
          Done
        </Button>
      </Modal>

      <Modal open={Boolean(videoAppt)} title="Video consultation" onClose={() => setVideoAppt(null)}>
        {videoAppt && (
          <div className="space-y-3">
            <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-900 text-white">
              <p className="text-sm">Mock video with {videoAppt.doctor}</p>
            </div>
            <Button className="w-full" onClick={() => setVideoAppt(null)}>
              End call
            </Button>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(rescheduleAppt)} title="Reschedule (once)" onClose={() => setRescheduleAppt(null)}>
        {rescheduleAppt && (
          <div className="space-y-2">
            <Input label="New date" type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} />
            <Input label="New time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} />
            <Button className="w-full" onClick={applyReschedule}>
              Save
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Booking
