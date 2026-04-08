import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { pharmacyRecommendationSlides, pharmacyStores, enrichProducts } from '../data/pharmacyData'
import { HEALTH_IMAGE_FALLBACK, HEALTH_IMG_CLASS, onHealthImageError } from '../utils/healthMediaFallback'

function PharmacyRecommendationDetails() {
  const { slideId } = useParams()
  const navigate = useNavigate()
  const slide = pharmacyRecommendationSlides.find((s) => s.id === slideId)
  const products = useMemo(() => enrichProducts(), [])

  const related = useMemo(() => {
    if (!slide) return []
    return products.filter((p) => {
      const blob = `${p.category} ${p.name} ${p.healthIssues.join(' ')}`.toLowerCase()
      return slide.filterTags.some((tag) => blob.includes(tag.toLowerCase()))
    })
  }, [slide, products])

  const stores = useMemo(() => {
    const ids = new Set(related.map((p) => p.storeId))
    return pharmacyStores.filter((s) => ids.has(s.id))
  }, [related])

  const browse = () => {
    if (!slide) return
    navigate('/pharmacy', { state: { activePharmacyFilterTags: slide.filterTags } })
  }

  if (!slide) {
    return (
      <div className="space-y-4">
        <PageHeader title="Offer not found" />
        <Button onClick={() => navigate('/pharmacy')}>Back to Pharmacy</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={slide.title}
        subtitle={slide.description}
        rightSlot={
          <Button variant="outline" onClick={() => navigate('/pharmacy')}>
            Back
          </Button>
        }
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
          <p className="text-sm leading-relaxed text-slate-600">{slide.detailBody}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={browse}>Shop this category</Button>
            <Button variant="secondary" onClick={() => navigate('/pharmacy')}>
              View all pharmacy
            </Button>
          </div>
        </Card>
        <Card title="Reviews">
          <ul className="space-y-2">
            {slide.reviews.map((r) => (
              <li key={r} className="rounded-xl border border-slate-200 p-2 text-sm text-slate-600">
                {r}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Partner stores">
        <div className="grid gap-3 sm:grid-cols-2">
          {stores.slice(0, 6).map((s) => (
            <div
              key={s.id}
              className="flex gap-3 rounded-xl border border-slate-200 p-3 shadow-sm transition hover:shadow-md"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={s.image || HEALTH_IMAGE_FALLBACK}
                  alt=""
                  className="h-24 w-24 object-cover rounded-lg"
                  onError={onHealthImageError}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-500">{s.address}</p>
                <p className="text-xs text-amber-600">★ {s.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Popular picks">
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {related.slice(0, 14).map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={p.image || HEALTH_IMAGE_FALLBACK}
                    alt=""
                    className={HEALTH_IMG_CLASS}
                    onError={onHealthImageError}
                  />
                </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800">{p.name}</p>
                <p className="text-xs text-slate-500">
                  {p.storeName} · ₹{p.price}
                </p>
              </div>
              </div>
              <div className="flex gap-2">
                <Badge
                  tone={
                    p.availability === 'In Stock' ? 'success' : p.availability === 'Low Stock' ? 'warning' : 'info'
                  }
                >
                  {p.availability}
                </Badge>
                <Button variant="secondary" onClick={() => navigate(`/pharmacy/product/${p.id}`)}>
                  Details
                </Button>
                <Button onClick={() => navigate('/pharmacy', { state: { orderProductId: p.id } })}>Order</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default PharmacyRecommendationDetails
