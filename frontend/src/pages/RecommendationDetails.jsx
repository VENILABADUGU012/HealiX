import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { bookingHospitals, recommendationSlides, enrichDoctors } from '../data/bookingData'
import { HEALTH_IMAGE_FALLBACK, HEALTH_IMG_CLASS, onHealthImageError } from '../utils/healthMediaFallback'

function RecommendationDetails() {
  const { slideId } = useParams()
  const navigate = useNavigate()
  const slide = recommendationSlides.find((s) => s.id === slideId)
  const doctors = useMemo(() => enrichDoctors(), [])

  const related = useMemo(() => {
    if (!slide) return []
    return doctors.filter((d) => {
      const blob = `${d.specialization} ${d.hospitalName} ${d.diseases.join(' ')}`.toLowerCase()
      return slide.filterTags.some((tag) => blob.includes(tag.toLowerCase()))
    })
  }, [slide, doctors])

  const hospitals = useMemo(() => {
    const ids = new Set(related.map((d) => d.hospitalId))
    return bookingHospitals.filter((h) => ids.has(h.id))
  }, [related])

  const goBook = () => {
    if (!slide) return
    navigate('/booking', { state: { activeCategoryTags: slide.filterTags } })
  }

  if (!slide) {
    return (
      <div className="space-y-4">
        <PageHeader title="Recommendation not found" />
        <Button onClick={() => navigate('/booking')}>Back to Booking</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={slide.title}
        subtitle={slide.description}
        rightSlot={<Button variant="outline" onClick={() => navigate('/booking')}>Back</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="mb-4 h-40 w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={slide.image || HEALTH_IMAGE_FALLBACK}
              alt=""
              className={HEALTH_IMG_CLASS}
              onError={onHealthImageError}
            />
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{slide.detailBody || slide.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={goBook}>Book Now</Button>
            <Button variant="secondary" onClick={goBook}>
              Browse matching providers
            </Button>
          </div>
        </Card>
        <Card title="Reviews">
          <ul className="space-y-2">
            {(slide.reviews || []).map((r) => (
              <li key={r} className="rounded-xl border border-slate-200 p-2 text-sm text-slate-600">
                {r}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Related hospitals">
        <div className="grid gap-3 sm:grid-cols-2">
          {hospitals.map((h) => (
            <div key={h.id} className="flex gap-3 rounded-xl border border-slate-200 p-3 shadow-sm transition hover:shadow-md">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={h.image || HEALTH_IMAGE_FALLBACK}
                  alt=""
                  className={HEALTH_IMG_CLASS}
                  onError={onHealthImageError}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{h.name}</p>
                <p className="text-xs text-slate-500">{h.location}</p>
                <p className="text-xs text-amber-600">★ {h.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Related doctors">
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {related.slice(0, 12).map((d) => (
            <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={d.image || HEALTH_IMAGE_FALLBACK}
                    alt=""
                    className={HEALTH_IMG_CLASS}
                    onError={onHealthImageError}
                  />
                </div>
                <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">{d.name}</p>
                <p className="text-xs text-slate-500">{d.specialization} · {d.hospitalName}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge tone="info">{d.mode === 'Both' ? 'Online / Offline' : d.mode}</Badge>
                <Button variant="secondary" onClick={() => navigate(`/booking/doctor/${d.id}`)}>
                  Profile
                </Button>
                <Button onClick={() => navigate('/booking', { state: { bookDoctorId: d.id } })}>Book</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default RecommendationDetails
