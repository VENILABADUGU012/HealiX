import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { getProductById } from '../data/pharmacyData'
import { HEALTH_IMAGE_FALLBACK, HEALTH_IMG_CLASS, onHealthImageError } from '../utils/healthMediaFallback'

function PharmacyProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const p = getProductById(productId)
  const gallery = useMemo(() => (p?.images?.length ? p.images : p?.image ? [p.image] : []), [p])
  const [heroByProduct, setHeroByProduct] = useState({})
  const mainImg = heroByProduct[productId] ?? gallery[0] ?? HEALTH_IMAGE_FALLBACK

  const messageStore = () => {
    if (!p) return
    navigate('/messages', {
      state: {
        openPharmacyChat: {
          storeId: p.storeId,
          storeName: p.storeName,
          address: p.storeAddress,
        },
      },
    })
  }

  if (!p) {
    return (
      <div className="space-y-4">
        <PageHeader title="Product not found" />
        <Button onClick={() => navigate('/pharmacy')}>Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={p.name}
        subtitle={`${p.storeName} · ${p.category}`}
        rightSlot={<Button variant="outline" onClick={() => navigate('/pharmacy')}>Back</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="mb-3 h-40 w-full overflow-hidden rounded-lg bg-gray-100">
            <img src={mainImg} alt="" className={HEALTH_IMG_CLASS} onError={onHealthImageError} />
          </div>
          {gallery.length > 1 ? (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {gallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setHeroByProduct((prev) => ({ ...prev, [productId]: src }))}
                  className={`shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 transition ${
                    mainImg === src ? 'ring-blue-500' : 'ring-transparent hover:ring-slate-300'
                  }`}
                >
                  <div className="h-14 w-14 overflow-hidden rounded-lg bg-gray-100">
                    <img src={src} alt="" className={HEALTH_IMG_CLASS} onError={onHealthImageError} />
                  </div>
                </button>
              ))}
            </div>
          ) : null}
          <p className="text-2xl font-bold text-slate-800">₹{p.price}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone={p.availability === 'In Stock' ? 'success' : p.availability === 'Low Stock' ? 'warning' : 'info'}>
              {p.availability}
            </Badge>
            <span className="text-sm text-amber-600">★ {p.rating} ({p.reviewCount})</span>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Button onClick={() => navigate('/pharmacy', { state: { orderProductId: p.id } })}>Order Now</Button>
            <Button variant="secondary" onClick={messageStore}>Message Store</Button>
          </div>
        </Card>
        <Card title="About this product" className="lg:col-span-2">
          <p className="text-sm text-slate-600">{p.description}</p>
          <p className="mt-4 text-sm font-medium text-slate-800">Recommended usage</p>
          <p className="text-sm text-slate-600">{p.usage}</p>
          <p className="mt-4 text-sm font-medium text-slate-800">Safety</p>
          <p className="text-sm text-slate-600">{p.safety}</p>
        </Card>
        <Card title="Store" className="lg:col-span-3">
          <p className="font-medium text-slate-800">{p.storeName}</p>
          <p className="text-sm text-slate-600">{p.storeAddress}</p>
          <p className="text-sm text-slate-500">Store rating: ★ {p.storeRating} · {p.storeReviewCount} reviews</p>
        </Card>
        <Card title="Reviews" className="lg:col-span-3">
          <ul className="space-y-2">
            {p.reviews.map((r) => (
              <li key={r} className="rounded-xl border border-slate-200 p-3 text-sm text-slate-600">{r}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default PharmacyProductDetail
