import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { getDoctorByParam } from '../data/bookingData'
import { HEALTH_IMAGE_FALLBACK, HEALTH_IMG_CLASS, onHealthImageError } from '../utils/healthMediaFallback'

function BookingDoctorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const doctor = useMemo(() => getDoctorByParam(id), [id])

  const openMessage = () => {
    if (!doctor) return
    navigate('/messages', {
      state: {
        openDoctorChat: {
          doctorId: doctor.id,
          name: doctor.name,
          hospital: doctor.hospitalName,
        },
      },
    })
  }

  const startBook = () => {
    navigate('/booking', { state: { bookDoctorId: doctor.id } })
  }

  if (!doctor) {
    return (
      <div className="space-y-4">
        <PageHeader title="Doctor not found" subtitle="Return to booking search." />
        <Button onClick={() => navigate('/booking')}>Back to Booking</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={doctor.name}
        subtitle={`${doctor.specialization} · ${doctor.hospitalName}`}
        rightSlot={<Button variant="outline" onClick={() => navigate('/booking')}>Back</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="mb-4 h-40 w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={doctor.image || HEALTH_IMAGE_FALLBACK}
              alt=""
              className={HEALTH_IMG_CLASS}
              onError={onHealthImageError}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="info">{doctor.mode === 'Both' ? 'Online / Offline' : doctor.mode}</Badge>
            <Badge tone="success">★ {doctor.rating}</Badge>
            <span className="text-sm text-slate-500">{doctor.reviewCount} reviews</span>
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-800">₹{doctor.fee} consultation</p>
          <p className="mt-1 text-sm text-slate-600">{doctor.phone}</p>
          <div className="mt-4 flex flex-col gap-2">
            <Button onClick={startBook}>Book Appointment</Button>
            <Button variant="secondary" onClick={openMessage}>Message</Button>
          </div>
        </Card>
        <Card title="About" className="lg:col-span-2">
          <p className="text-sm text-slate-600">{doctor.description || doctor.about}</p>
          <p className="mt-4 text-sm font-medium text-slate-700">Hospital</p>
          <p className="text-sm text-slate-600">{doctor.hospitalName}</p>
          {doctor.hospitalLocation ? <p className="text-sm text-slate-500">{doctor.hospitalLocation}</p> : null}
          <p className="mt-4 text-sm font-medium text-slate-700">Focus areas</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {doctor.diseases.map((d) => (
              <span key={d} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{d}</span>
            ))}
          </div>
        </Card>
        <Card title="Patient reviews" className="lg:col-span-3">
          <ul className="space-y-2">
            {doctor.reviews.map((r) => (
              <li key={r} className="rounded-xl border border-slate-200 p-3 text-sm text-slate-600">{r}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default BookingDoctorDetail
