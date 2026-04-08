import { useCallback, useEffect, useRef } from 'react'
import { loadAppointments } from '../../utils/bookingStorage'
import { loadDoctorThreads } from '../../utils/messageThreadsStorage'
import { loadPharmacyOrders } from '../../utils/pharmacyStorage'
import { loadPharmacyThreads } from '../../utils/pharmacyThreadsStorage'
import useNotifications from '../../hooks/useNotifications'

function countIncomingDoctorMessages(threads) {
  return threads.reduce((n, t) => n + (t.messages || []).filter((m) => m.from !== 'user').length, 0)
}

function countIncomingPharmacyMessages(threads) {
  return threads.reduce(
    (n, t) =>
      n +
      (t.messages || []).filter((m) => {
        const s = m.sender ?? (m.from === 'user' ? 'user' : 'store')
        return s !== 'user'
      }).length,
    0,
  )
}

function WorkspaceNotificationBridge() {
  const { pushInboxNotification } = useNotifications()
  const ready = useRef(false)
  const apptIds = useRef(new Set())
  const orderIds = useRef(new Set())
  const orderState = useRef(new Map())
  const incomingDoctor = useRef(0)
  const incomingPharmacy = useRef(0)

  const scan = useCallback(() => {
    const appts = loadAppointments()
    const orders = loadPharmacyOrders()
    const docThreads = loadDoctorThreads()
    const phThreads = loadPharmacyThreads()

    if (!ready.current) {
      apptIds.current = new Set(appts.map((a) => String(a.id)))
      orderIds.current = new Set(orders.map((o) => String(o.id)))
      orderState.current = new Map(orders.map((o) => [String(o.id), o.status]))
      incomingDoctor.current = countIncomingDoctorMessages(docThreads)
      incomingPharmacy.current = countIncomingPharmacyMessages(phThreads)
      ready.current = true
      return
    }

    const nextAppt = new Set(appts.map((a) => String(a.id)))
    for (const id of nextAppt) {
      if (!apptIds.current.has(id)) {
        const a = appts.find((x) => String(x.id) === id)
        pushInboxNotification({
          title: 'Appointment booked',
          description: a ? `${a.doctor} on ${a.date}` : 'New visit added',
          type: 'booking',
        })
      }
    }
    apptIds.current = nextAppt

    for (const o of orders) {
      const oid = String(o.id)
      if (!orderIds.current.has(oid)) {
        pushInboxNotification({
          title: 'Order placed',
          description: o.productName || 'Pharmacy order',
          type: 'pharmacy',
        })
      }
      const prevSt = orderState.current.get(oid)
      if (prevSt && prevSt !== 'Delivered' && o.status === 'Delivered') {
        pushInboxNotification({
          title: 'Order delivered',
          description: o.productName || 'Your order arrived',
          type: 'pharmacy',
        })
      }
    }
    orderIds.current = new Set(orders.map((o) => String(o.id)))
    orderState.current = new Map(orders.map((o) => [String(o.id), o.status]))

    const dInc = countIncomingDoctorMessages(docThreads)
    const pInc = countIncomingPharmacyMessages(phThreads)
    if (dInc > incomingDoctor.current || pInc > incomingPharmacy.current) {
      pushInboxNotification({
        title: 'New message',
        description: 'Open Messages to read your conversation.',
        type: 'message',
      })
    }
    incomingDoctor.current = dInc
    incomingPharmacy.current = pInc
  }, [pushInboxNotification])

  useEffect(() => {
    scan()
    const events = [
      'healix-appointments-changed',
      'healix-pharmacy-orders-changed',
      'healix-doctor-threads-changed',
      'healix-pharmacy-threads-changed',
    ]
    events.forEach((e) => window.addEventListener(e, scan))
    return () => events.forEach((e) => window.removeEventListener(e, scan))
  }, [scan])

  return null
}

export default WorkspaceNotificationBridge
