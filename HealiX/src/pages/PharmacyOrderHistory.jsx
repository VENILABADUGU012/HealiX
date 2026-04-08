import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { PHARMACY_ORDERS_EVENT, loadPharmacyOrders } from '../utils/pharmacyStorage'
import { getProductById } from '../data/pharmacyData'
import { HEALTH_IMAGE_FALLBACK, HEALTH_IMG_CLASS, onHealthImageError } from '../utils/healthMediaFallback'

function formatOrderDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

function PharmacyOrderHistory() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState(() => loadPharmacyOrders())

  useEffect(() => {
    const load = () => setOrders(loadPharmacyOrders())
    load()
    window.addEventListener(PHARMACY_ORDERS_EVENT, load)
    return () => window.removeEventListener(PHARMACY_ORDERS_EVENT, load)
  }, [])

  const sorted = useMemo(
    () =>
      [...orders].sort((a, b) => {
        const ta = new Date(a.createdAt || 0).getTime()
        const tb = new Date(b.createdAt || 0).getTime()
        return tb - ta
      }),
    [orders],
  )

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pharmacy order history"
        subtitle="All your medicine orders"
        rightSlot={
          <Button variant="outline" onClick={() => navigate('/pharmacy')}>
            Back to Pharmacy
          </Button>
        }
      />
      <Card>
        {sorted.length === 0 ? (
          <p className="text-sm text-slate-500">No orders yet.</p>
        ) : (
          <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
            {sorted.map((o) => {
              const img =
                o.productImage || getProductById(o.productId)?.image || HEALTH_IMAGE_FALLBACK
              return (
                <div
                  key={o.id}
                  className="flex gap-3 rounded-xl border border-slate-200 p-4 transition-all duration-300 hover:shadow-md"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img src={img} alt="" className={HEALTH_IMG_CLASS} onError={onHealthImageError} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-slate-800">{o.productName}</p>
                        <p className="text-sm text-slate-600">{o.storeName}</p>
                        <p className="text-sm text-slate-500">{formatOrderDate(o.createdAt)}</p>
                      </div>
                      <Badge
                        tone={
                          o.status === 'Delivered'
                          ? 'success'
                          : o.status === 'Out for delivery'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {o.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button variant="secondary" onClick={() => navigate(`/pharmacy/order/${o.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}

export default PharmacyOrderHistory
