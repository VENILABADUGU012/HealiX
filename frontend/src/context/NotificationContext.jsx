import { useCallback, useEffect, useMemo, useState } from 'react'
import NotificationContext from './notificationContextObject'
import { APP_INBOX_EVENT, loadAppInbox, saveAppInbox } from '../utils/appInboxStorage'

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [inboxNotifications, setInboxNotifications] = useState(() => loadAppInbox())

  useEffect(() => {
    const sync = () => setInboxNotifications(loadAppInbox())
    window.addEventListener(APP_INBOX_EVENT, sync)
    return () => window.removeEventListener(APP_INBOX_EVENT, sync)
  }, [])

  const pushToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 5000)
  }, [])

  const triggerReminder = useCallback(
    (medicineName, time) => {
      pushToast(`Medicine reminder: ${medicineName} at ${time}`, 'warning')
      if (
        import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true' &&
        typeof window !== 'undefined' &&
        'Notification' in window
      ) {
        if (Notification.permission === 'granted') {
          new Notification('HealiX Reminder', { body: `Take ${medicineName} at ${time}` })
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission()
        }
      }
    },
    [pushToast],
  )

  const pushInboxNotification = useCallback((partial) => {
    const item = {
      id: `inbox-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: partial.title,
      description: partial.description,
      type: partial.type || 'message',
      read: false,
      time: new Date().toISOString(),
    }
    const next = [item, ...loadAppInbox()].slice(0, 80)
    saveAppInbox(next)
    setInboxNotifications(next)
  }, [])

  const markInboxRead = useCallback((id) => {
    const next = loadAppInbox().map((n) => (n.id === id ? { ...n, read: true } : n))
    saveAppInbox(next)
    setInboxNotifications(next)
  }, [])

  const markAllInboxRead = useCallback(() => {
    const next = loadAppInbox().map((n) => ({ ...n, read: true }))
    saveAppInbox(next)
    setInboxNotifications(next)
  }, [])

  const unreadInboxCount = useMemo(
    () => inboxNotifications.filter((n) => !n.read).length,
    [inboxNotifications],
  )

  const value = useMemo(
    () => ({
      toasts,
      pushToast,
      triggerReminder,
      inboxNotifications,
      pushInboxNotification,
      markInboxRead,
      markAllInboxRead,
      unreadInboxCount,
    }),
    [
      toasts,
      pushToast,
      triggerReminder,
      inboxNotifications,
      pushInboxNotification,
      markInboxRead,
      markAllInboxRead,
      unreadInboxCount,
    ],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
