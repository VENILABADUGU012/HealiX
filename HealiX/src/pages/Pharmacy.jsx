import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/feedback/EmptyState'
import { enrichProducts, pharmacyRecommendationSlides } from '../data/pharmacyData'
import {
  PHARMACY_ORDERS_EVENT,
  addDeliveryReminder,
  loadPharmacyBookmarks,
  loadPharmacyOrders,
  savePharmacyOrders,
  togglePharmacyBookmark,
} from '../utils/pharmacyStorage'
import useNotifications from '../hooks/useNotifications'
import { HEALTH_IMAGE_FALLBACK, HEALTH_IMG_CLASS, onHealthImageError } from '../utils/healthMediaFallback'

function Pharmacy() {
  const navigate = useNavigate()
  const location = useLocation()
  const { pushToast } = useNotifications()
  const products = useMemo(() => enrichProducts(), [])
  const carouselRef = useRef(null)

  const [search, setSearch] = useState('')
  const [activeTags, setActiveTags] = useState([])
  const [bookmarks, setBookmarks] = useState(() => loadPharmacyBookmarks())
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [orders, setOrders] = useState(() => loadPharmacyOrders())

  const [orderProduct, setOrderProduct] = useState(null)
  const [orderStep, setOrderStep] = useState(1)
  const [qty, setQty] = useState(1)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [deliveryType, setDeliveryType] = useState('Standard')
  const [adultConfirm, setAdultConfirm] = useState(false)
  const [verificationCall, setVerificationCall] = useState(false)
  const [address, setAddress] = useState('')
  const [successOpen, setSuccessOpen] = useState(false)
  const [trackOrder, setTrackOrder] = useState(null)

  const refreshOrders = useCallback(() => setOrders(loadPharmacyOrders()), [])
  const refreshBookmarks = useCallback(() => setBookmarks(loadPharmacyBookmarks()), [])

  useEffect(() => {
    const onO = () => refreshOrders()
    const onB = () => refreshBookmarks()
    window.addEventListener(PHARMACY_ORDERS_EVENT, onO)
    window.addEventListener('healix-pharmacy-bookmarks-changed', onB)
    return () => {
      window.removeEventListener(PHARMACY_ORDERS_EVENT, onO)
      window.removeEventListener('healix-pharmacy-bookmarks-changed', onB)
    }
  }, [refreshOrders, refreshBookmarks])

  /* eslint-disable react-hooks/set-state-in-effect -- router-driven pharmacy state */
  useEffect(() => {
    const st = location.state
    if (!st) return
    let applied = false
    if (st.activePharmacyFilterTags?.length) {
      setActiveTags(st.activePharmacyFilterTags)
      applied = true
    }
    if (st.orderProductId) {
      const p = products.find((x) => x.id === st.orderProductId)
      if (p && p.availability !== 'Out of Stock') {
        setOrderProduct(p)
        setOrderStep(1)
        setQty(1)
        setAdultConfirm(false)
        setVerificationCall(false)
        applied = true
      }
    }
    if (applied) navigate(location.pathname, { replace: true, state: {} })
  }, [location.state, navigate, location.pathname, products])
  /* eslint-enable react-hooks/set-state-in-effect */

  const scrollCarousel = (dir) => {
    const el = carouselRef.current
    if (!el) return
    el.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  const categoryList = useMemo(() => {
    const s = new Set(products.map((p) => p.category))
    return ['All', ...[...s].sort()]
  }, [products])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = products.filter((p) => {
      const tagOk =
        !activeTags.length ||
        activeTags.some((tag) => {
          const blob = `${p.category} ${p.name} ${p.healthIssues.join(' ')}`.toLowerCase()
          return blob.includes(tag.toLowerCase())
        })
      const catOk = categoryFilter === 'All' || p.category === categoryFilter
      const availOk =
        availabilityFilter === 'all' ||
        p.availability.toLowerCase().replace(/\s/g, '') === availabilityFilter.toLowerCase().replace(/\s/g, '')
      const searchOk =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.storeName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.healthIssues.some((h) => h.toLowerCase().includes(q))
      return tagOk && catOk && availOk && searchOk
    })
    if (showBookmarksOnly) list = list.filter((p) => bookmarks.includes(p.id))
    list = [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'price') return a.price - b.price
      return a.name.localeCompare(b.name)
    })
    return list
  }, [
    products,
    activeTags,
    categoryFilter,
    availabilityFilter,
    search,
    showBookmarksOnly,
    bookmarks,
    sortBy,
  ])

  const toggleBm = (productId) => {
    const next = togglePharmacyBookmark(productId)
    setBookmarks(next)
  }

  const openOrder = (p) => {
    if (p.availability === 'Out of Stock') {
      pushToast('This product is currently out of stock.', 'info')
      return
    }
    setOrderProduct(p)
    setOrderStep(1)
    setQty(1)
    setAdultConfirm(false)
    setVerificationCall(false)
    setDeliveryDate('')
    setDeliveryTime('')
    setAddress('')
  }

  const slots = ['10 AM – 12 PM', '12 PM – 2 PM', '2 PM – 4 PM', '4 PM – 6 PM', '6 PM – 8 PM']

  const confirmOrder = () => {
    if (!orderProduct || !deliveryDate || !deliveryTime || !adultConfirm || !address.trim()) return
    const totalPrice = orderProduct.price * qty
    const next = [
      ...loadPharmacyOrders(),
      {
        id: `ph-${Date.now()}`,
        productId: orderProduct.id,
        productName: orderProduct.name,
        productImage: orderProduct.image,
        storeId: orderProduct.storeId,
        storeName: orderProduct.storeName,
        storeAddress: orderProduct.storeAddress,
        quantity: qty,
        deliveryDate,
        deliveryTime,
        deliveryType,
        address: address.trim(),
        totalPrice,
        status: 'Pending',
        adultConfirm,
        verificationCall,
        createdAt: new Date().toISOString(),
      },
    ]
    savePharmacyOrders(next)
    setOrders(next)
    setOrderProduct(null)
    setOrderStep(1)
    setSuccessOpen(true)
  }

  const messageStore = (p) => {
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

  const setOrderStatusDemo = (order, status) => {
    const next = loadPharmacyOrders().map((o) => (o.id === order.id ? { ...o, status } : o))
    savePharmacyOrders(next)
    setOrders(next)
    pushToast(`Status: ${status}`, 'info')
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Pharmacy" subtitle="Order medicines, schedule delivery, and track every order." />

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
              {pharmacyRecommendationSlides.map((slide) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => navigate(`/pharmacy/recommendations/${slide.id}`)}
                  className="min-w-[240px] max-w-[260px] shrink-0 rounded-xl border border-slate-200 bg-white text-left shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative h-40 overflow-hidden rounded-t-xl bg-gray-100">
                    <img
                      src={slide.image || HEALTH_IMAGE_FALLBACK}
                      alt=""
                      className={HEALTH_IMG_CLASS}
                      onError={onHealthImageError}
                    />
                    {slide.productPreviewImage ? (
                      <div className="absolute bottom-2 right-2 h-12 w-12 overflow-hidden rounded-lg border-2 border-white bg-gray-100 shadow-md">
                        <img
                          src={slide.productPreviewImage}
                          alt=""
                          className={HEALTH_IMG_CLASS}
                          onError={onHealthImageError}
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-slate-800">{slide.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{slide.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {activeTags.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              Filters: {activeTags.join(', ')}
              <button type="button" className="ml-2 text-blue-600 underline" onClick={() => setActiveTags([])}>
                Clear
              </button>
            </p>
          )}
        </Card>

        <Card title="Your orders">
          <div className="mb-3">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/pharmacy/history')}>
              View History
            </Button>
          </div>
          <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {orders.length === 0 ? (
              <p className="text-sm text-slate-500">No orders yet. Browse products below.</p>
            ) : (
              orders.slice(0, 12).map((o) => {
                const thumb =
                  o.productImage || products.find((x) => x.id === o.productId)?.image || HEALTH_IMAGE_FALLBACK
                return (
                <div
                  key={o.id}
                  className="flex gap-3 rounded-xl border border-slate-200 p-3 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img src={thumb} alt="" className={HEALTH_IMG_CLASS} onError={onHealthImageError} />
                  </div>
                  <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800">{o.productName}</p>
                  <p className="text-sm text-slate-600">{o.storeName}</p>
                  <p className="text-sm text-slate-500">
                    {o.deliveryDate} · {o.deliveryTime} · {o.deliveryType}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
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
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => navigate(`/pharmacy/order/${o.id}`)}>
                      View Details
                    </Button>
                    <Button variant="outline" onClick={() => setTrackOrder(o)}>
                      Track Order
                    </Button>
                    <Button variant="outline" onClick={() => messageStore({ storeId: o.storeId, storeName: o.storeName, storeAddress: o.storeAddress })}>
                      Contact Store
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        addDeliveryReminder(o.id, `Delivery reminder: ${o.productName}`)
                        pushToast('Reminder saved for this order.', 'info')
                      }}
                    >
                      Reminder
                    </Button>
                    {o.status === 'Pending' && (
                      <Button variant="outline" onClick={() => setOrderStatusDemo(o, 'Out for delivery')}>
                        Mark out for delivery
                      </Button>
                    )}
                    {o.status === 'Out for delivery' && (
                      <Button variant="outline" onClick={() => setOrderStatusDemo(o, 'Delivered')}>
                        Mark delivered
                      </Button>
                    )}
                  </div>
                  </div>
                </div>
                )
              })
            )}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            type="search"
            placeholder="Search medicine, health issue, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              {showBookmarksOnly ? 'All products' : `Bookmarks (${bookmarks.length})`}
            </Button>
          </div>
        </div>
      </Card>

      <div>
        <p className="mb-3 text-sm font-medium text-slate-700">{filtered.length} products</p>
        <div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <EmptyState title="No matches" subtitle="Try adjusting search or filters." />
          ) : (
            filtered.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-md transition-all duration-300 hover:shadow-xl sm:flex-row"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-40 sm:w-36">
                  <img
                    src={p.image || HEALTH_IMAGE_FALLBACK}
                    alt=""
                    className={HEALTH_IMG_CLASS}
                    onError={onHealthImageError}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{p.name}</p>
                      <p className="text-sm text-slate-600">{p.storeName}</p>
                      <p className="text-xs text-slate-500">{p.storeAddress}</p>
                    </div>
                    <button
                      type="button"
                      aria-label="Bookmark"
                      className={`text-xl transition ${bookmarks.includes(p.id) ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'}`}
                      onClick={() => toggleBm(p.id)}
                    >
                      ♥
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-amber-600">★ {p.rating}</span>
                    <span className="text-slate-500">({p.reviewCount})</span>
                    <Badge tone={p.availability === 'In Stock' ? 'success' : p.availability === 'Low Stock' ? 'warning' : 'info'}>
                      {p.availability}
                    </Badge>
                    <span className="font-medium text-slate-800">₹{p.price}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => navigate(`/pharmacy/product/${p.id}`)}>
                      View Details
                    </Button>
                    <Button onClick={() => openOrder(p)}>Order</Button>
                    <Button variant="outline" onClick={() => messageStore(p)}>
                      Message Store
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal open={filterOpen} title="Filters" onClose={() => setFilterOpen(false)}>
        <div className="space-y-3">
          <p className="text-sm font-medium">Category</p>
          <select
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categoryList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <p className="text-sm font-medium">Availability</p>
          <div className="flex flex-wrap gap-2">
            {['all', 'In Stock', 'Low Stock', 'Out of Stock'].map((a) => (
              <Button key={a} variant={availabilityFilter === a ? 'primary' : 'secondary'} onClick={() => setAvailabilityFilter(a)}>
                {a === 'all' ? 'All' : a}
              </Button>
            ))}
          </div>
          <p className="text-sm font-medium">Sort</p>
          <select
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Rating</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
          <Button className="w-full" onClick={() => setFilterOpen(false)}>
            Apply
          </Button>
        </div>
      </Modal>

      <Modal open={Boolean(orderProduct)} title="Place order" onClose={() => setOrderProduct(null)}>
        {orderProduct && (
          <div className="space-y-4 text-sm">
            <p className="text-slate-600">
              {orderProduct.name} · {orderProduct.storeName}
            </p>
            {orderStep === 1 && (
              <div className="space-y-2">
                <label className="flex flex-col gap-1">
                  <span className="font-medium text-slate-700">Quantity</span>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                    className="rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <Button className="w-full" onClick={() => setOrderStep(2)}>
                  Continue
                </Button>
              </div>
            )}
            {orderStep === 2 && (
              <div className="space-y-2">
                <Input label="Delivery date" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                <p className="font-medium">Time slot</p>
                <div className="flex flex-wrap gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`rounded-lg px-2 py-1 text-xs ${deliveryTime === s ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
                      onClick={() => setDeliveryTime(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="font-medium">Delivery type</p>
                <div className="flex gap-2">
                  <Button variant={deliveryType === 'Standard' ? 'primary' : 'secondary'} onClick={() => setDeliveryType('Standard')}>
                    Standard
                  </Button>
                  <Button variant={deliveryType === 'Express' ? 'primary' : 'secondary'} onClick={() => setDeliveryType('Express')}>
                    Express
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOrderStep(1)}>
                    Back
                  </Button>
                  <Button className="flex-1" disabled={!deliveryDate || !deliveryTime} onClick={() => setOrderStep(3)}>
                    Next
                  </Button>
                </div>
              </div>
            )}
            {orderStep === 3 && (
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={adultConfirm} onChange={(e) => setAdultConfirm(e.target.checked)} />
                  <span>I confirm adult usage / prescription guidance for this medicine.</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={verificationCall} onChange={(e) => setVerificationCall(e.target.checked)} />
                  <span>Optional: schedule pharmacist verification call</span>
                </label>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOrderStep(2)}>
                    Back
                  </Button>
                  <Button className="flex-1" disabled={!adultConfirm} onClick={() => setOrderStep(4)}>
                    Next
                  </Button>
                </div>
              </div>
            )}
            {orderStep === 4 && (
              <div className="space-y-2">
                <label className="flex flex-col gap-1">
                  <span className="font-medium text-slate-700">Delivery address</span>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="min-h-24 rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Flat, street, PIN"
                  />
                </label>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOrderStep(3)}>
                    Back
                  </Button>
                  <Button className="flex-1" disabled={!address.trim()} onClick={() => setOrderStep(5)}>
                    Continue to payment
                  </Button>
                </div>
              </div>
            )}
            {orderStep === 5 && (
              <div className="space-y-2 rounded-xl bg-slate-50 p-4">
                <p>
                  <strong>Product:</strong> {orderProduct.name} x {qty}
                </p>
                <p>
                  <strong>Store:</strong> {orderProduct.storeName}
                </p>
                <p>
                  <strong>Total:</strong> ₹{orderProduct.price * qty}
                </p>
                <p>
                  <strong>Slot:</strong> {deliveryDate} {deliveryTime}
                </p>
                <Button className="w-full" onClick={confirmOrder}>
                  Pay &amp; Place Order
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setOrderStep(4)}>
                  Back
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal open={successOpen} title="Order placed" onClose={() => setSuccessOpen(false)}>
        <p className="text-sm text-slate-600">Your order is confirmed. Track it in the orders widget.</p>
        <Button className="mt-3 w-full" onClick={() => setSuccessOpen(false)}>
          Done
        </Button>
      </Modal>

      <Modal open={Boolean(trackOrder)} title="Track order" onClose={() => setTrackOrder(null)}>
        {trackOrder && (
          <div className="space-y-3 text-sm text-slate-600">
            <p className="font-medium text-slate-800">{trackOrder.productName}</p>
            <ul className="space-y-2 border-l-2 border-blue-200 pl-4">
              <li>Order placed · {trackOrder.status === 'Pending' ? 'current' : 'done'}</li>
              <li>Packed at store · {trackOrder.status !== 'Pending' ? 'done' : 'pending'}</li>
              <li>Out for delivery · {trackOrder.status === 'Out for delivery' ? 'current' : trackOrder.status === 'Delivered' ? 'done' : 'pending'}</li>
              <li>Delivered · {trackOrder.status === 'Delivered' ? 'done' : 'pending'}</li>
            </ul>
            <Button className="w-full" onClick={() => setTrackOrder(null)}>
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Pharmacy
