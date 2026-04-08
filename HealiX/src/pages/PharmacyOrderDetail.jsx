import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { PHARMACY_ORDERS_EVENT, loadPharmacyOrders } from '../utils/pharmacyStorage'
import { getProductById } from '../data/pharmacyData'
import { HEALTH_IMAGE_FALLBACK, HEALTH_IMG_CLASS, onHealthImageError } from '../utils/healthMediaFallback'

function PharmacyOrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const load = () => setOrder(loadPharmacyOrders().find((o) => o.id === orderId) || null)
    load()
    window.addEventListener(PHARMACY_ORDERS_EVENT, load)
    return () => window.removeEventListener(PHARMACY_ORDERS_EVENT, load)
  }, [orderId])

  const product = order ? getProductById(order.productId) : null

  const messageStore = () => {
    if (!order) return
    navigate('/messages', {
      state: {
        openPharmacyChat: {
          storeId: order.storeId,
          storeName: order.storeName,
          address: order.storeAddress || '',
        },
      },
    })
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <PageHeader title="Order not found" />
        <Button onClick={() => navigate('/pharmacy')}>Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order details"
        subtitle={`${order.productName} · ${order.id}`}
        rightSlot={<Button variant="outline" onClick={() => navigate('/pharmacy')}>Back</Button>}
      />

      <div className="flex flex-wrap gap-2">
        <Badge tone={order.status === 'Delivered' ? 'success' : order.status === 'Out for delivery' ? 'info' : 'warning'}>
          {order.status}
        </Badge>
        <Badge tone="default">{order.deliveryType}</Badge>
      </div>

      <Card title="Product">
        <div className="mb-3 h-40 w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={order.productImage || product?.image || HEALTH_IMAGE_FALLBACK}
            alt=""
            className={HEALTH_IMG_CLASS}
            onError={onHealthImageError}
          />
        </div>
        <p className="font-medium text-slate-800">{order.productName}</p>
        <p className="text-sm text-slate-600">Qty: {order.quantity} · ₹{order.totalPrice} total</p>
        <p className="mt-2 text-sm text-slate-600">{product?.description}</p>
      </Card>

      <Card title="Recommended usage">
        <p className="text-sm text-slate-600">{product?.usage || 'Follow pack insert or pharmacist advice.'}</p>
      </Card>

      <Card title="Safety">
        <p className="text-sm text-slate-600">{product?.safety || 'Read label for warnings and interactions.'}</p>
      </Card>

      <Card title="Store">
        <p className="font-medium text-slate-800">{order.storeName}</p>
        <p className="text-sm text-slate-600">{order.storeAddress}</p>
        <Button className="mt-3" variant="secondary" onClick={messageStore}>Message Store</Button>
      </Card>

      <Card title="Delivery">
        <p className="text-sm text-slate-600">{order.deliveryDate} · {order.deliveryTime}</p>
        <p className="text-sm text-slate-500">{order.address}</p>
      </Card>

      <Card title="Reviews">
        <ul className="space-y-2">
          {(product?.reviews || ['Great service on this order.', 'On-time delivery.']).map((r) => (
            <li key={r} className="rounded-xl border border-slate-200 p-2 text-sm text-slate-600">{r}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export default PharmacyOrderDetail
