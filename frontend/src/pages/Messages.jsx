import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import PageHeader from '../components/common/PageHeader'
import LoadingState from '../components/feedback/LoadingState'
import ErrorState from '../components/feedback/ErrorState'
import EmptyState from '../components/feedback/EmptyState'
import useAsyncData from '../hooks/useAsyncData'
import { fetchMessagesData } from '../services/healthApi'
import useNotifications from '../hooks/useNotifications'
import { appendToThread, ensureDoctorThread, loadDoctorThreads } from '../utils/messageThreadsStorage'
import {
  appendPharmacyThreadMessage,
  ensurePharmacyThread,
  loadPharmacyThreads,
} from '../utils/pharmacyThreadsStorage'

function Messages() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data, loading, error, refetch } = useAsyncData(fetchMessagesData, [])
  const { pushToast } = useNotifications()
  const [filter, setFilter] = useState('All')
  const [text, setText] = useState('')
  const [outgoingMessages, setOutgoingMessages] = useState([])
  const [doctorThreads, setDoctorThreads] = useState(() => loadDoctorThreads())
  const [activeDoctorId, setActiveDoctorId] = useState(null)
  const [pharmacyThreads, setPharmacyThreads] = useState(() => loadPharmacyThreads())
  const [activeStoreId, setActiveStoreId] = useState(null)

  const refreshDoctorThreads = () => setDoctorThreads(loadDoctorThreads())
  const refreshPharmacyThreads = () => setPharmacyThreads(loadPharmacyThreads())

  useEffect(() => {
    const onD = () => refreshDoctorThreads()
    const onP = () => refreshPharmacyThreads()
    window.addEventListener('healix-doctor-threads-changed', onD)
    window.addEventListener('healix-pharmacy-threads-changed', onP)
    return () => {
      window.removeEventListener('healix-doctor-threads-changed', onD)
      window.removeEventListener('healix-pharmacy-threads-changed', onP)
    }
  }, [])

  /* eslint-disable react-hooks/set-state-in-effect -- open doctor thread from Booking */
  useEffect(() => {
    const chat = location.state?.openDoctorChat
    if (!chat?.name || chat.doctorId == null) return
    const welcome = `Hello! I'm ${chat.name}${chat.hospital ? ` from ${chat.hospital}` : ''}. Message me anytime about your visit.`
    ensureDoctorThread(chat.doctorId, chat.name, chat.hospital, welcome)
    refreshDoctorThreads()
    setActiveDoctorId(chat.doctorId)
    setActiveStoreId(null)
    setFilter('Doctors')
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.state, location.pathname, navigate])
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect -- open pharmacy thread from Pharmacy */
  useEffect(() => {
    const chat = location.state?.openPharmacyChat
    if (!chat?.storeName || chat.storeId == null) return
    const welcome = `Thanks for contacting ${chat.storeName}. We can help with order status, substitutions, and delivery.`
    ensurePharmacyThread(chat.storeId, chat.storeName, chat.address, welcome)
    refreshPharmacyThreads()
    setActiveStoreId(chat.storeId)
    setActiveDoctorId(null)
    setFilter('Pharmacy')
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.state, location.pathname, navigate])
  /* eslint-enable react-hooks/set-state-in-effect */

  const apiMessages = useMemo(() => [...(data || []), ...outgoingMessages], [data, outgoingMessages])

  const activeDoctorThread = doctorThreads.find((t) => t.doctorId === activeDoctorId)
  const activePharmacyThread = pharmacyThreads.find((t) => t.storeId === activeStoreId)

  const visible = useMemo(() => {
    if (filter === 'Doctors' && activeDoctorId != null && activeDoctorThread) {
      return activeDoctorThread.messages.map((m, idx) => ({
        id: `d-${activeDoctorId}-${idx}-${m.id}`,
        from: m.from === 'user' ? 'You' : activeDoctorThread.doctorName,
        channel: 'Doctors',
        text: m.text,
        time: m.time,
      }))
    }
    if (filter === 'Doctors' && activeDoctorId == null) return []
    if (filter === 'Pharmacy' && activeStoreId != null && activePharmacyThread) {
      return activePharmacyThread.messages.map((m, idx) => ({
        id: `p-${activeStoreId}-${idx}-${m.id}`,
        from: m.sender === 'user' || m.from === 'user' ? 'You' : activePharmacyThread.storeName,
        channel: 'Pharmacy',
        text: m.text,
        time: m.time,
      }))
    }
    if (filter === 'Pharmacy' && activeStoreId == null) return []
    return filter === 'All' ? apiMessages : apiMessages.filter((m) => m.channel === filter)
  }, [filter, activeDoctorId, activeDoctorThread, activeStoreId, activePharmacyThread, apiMessages])

  if (loading) return <LoadingState label="Loading conversations..." />
  if (error) return <ErrorState message={error} onRetry={refetch} />

  const send = () => {
    if (!text.trim()) return
    if (filter === 'Doctors' && activeDoctorId != null) {
      const msg = { id: Date.now(), from: 'user', text: text.trim(), time: 'Now' }
      appendToThread(activeDoctorId, msg)
      refreshDoctorThreads()
      pushToast('Message sent.', 'info')
      setText('')
      return
    }
    if (filter === 'Pharmacy' && activeStoreId != null) {
      const msg = { id: Date.now(), sender: 'user', text: text.trim(), time: 'Now' }
      appendPharmacyThreadMessage(activeStoreId, msg)
      refreshPharmacyThreads()
      pushToast('Message sent.', 'info')
      setText('')
      return
    }
    setOutgoingMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        from: 'You',
        channel: filter === 'All' ? 'Support' : filter,
        text,
        time: 'Now',
      },
    ])
    pushToast('Message sent successfully.', 'info')
    setText('')
  }

  const threadInputDisabled =
    (filter === 'Doctors' && activeDoctorId == null) || (filter === 'Pharmacy' && activeStoreId == null)

  return (
    <div className="space-y-4">
      <PageHeader title="Messages" subtitle="Chat with doctors, pharmacy, and support teams." />
      <Card>
        <div className="mb-3 flex gap-2">
          {['All', 'Doctors', 'Pharmacy', 'Support'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`rounded-lg px-3 py-1 text-sm ${filter === tab ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              onClick={() => {
                setFilter(tab)
                if (tab !== 'Doctors') setActiveDoctorId(null)
                if (tab !== 'Pharmacy') setActiveStoreId(null)
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {filter === 'Doctors' && (
          <div className="mb-3 flex flex-col gap-3 md:flex-row">
            <div className="max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 md:w-56">
              {doctorThreads.length === 0 ? (
                <p className="p-2 text-xs text-slate-500">No doctor threads yet. Open Messages from Booking.</p>
              ) : (
                doctorThreads.map((t) => (
                  <button
                    key={t.doctorId}
                    type="button"
                    onClick={() => setActiveDoctorId(t.doctorId)}
                    className={`mb-1 w-full rounded-lg px-2 py-2 text-left text-sm transition ${
                      activeDoctorId === t.doctorId ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-medium">{t.doctorName}</span>
                    <span className="block truncate text-xs opacity-80">{t.hospital}</span>
                  </button>
                ))
              )}
            </div>
            <div className="min-h-64 flex-1">
              {activeDoctorId == null ? (
                <EmptyState title="Select a doctor" subtitle="Choose a conversation on the left, or message a doctor from Booking." />
              ) : visible.length === 0 ? (
                <EmptyState title="No messages yet" subtitle="Say hello below." />
              ) : (
                <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3">
                  {visible.map((m) => (
                    <div key={m.id} className="rounded-lg bg-white p-2 text-sm">
                      <p className="font-medium text-slate-800">
                        {m.from} <span className="text-xs text-slate-500">({m.time})</span>
                      </p>
                      <p className="text-slate-600">{m.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {filter === 'Pharmacy' && (
          <div className="mb-3 flex flex-col gap-3 md:flex-row">
            <div className="max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 md:w-56">
              {pharmacyThreads.length === 0 ? (
                <p className="p-2 text-xs text-slate-500">No store chats yet. Message a store from Pharmacy.</p>
              ) : (
                pharmacyThreads.map((t) => (
                  <button
                    key={t.storeId}
                    type="button"
                    onClick={() => setActiveStoreId(t.storeId)}
                    className={`mb-1 w-full rounded-lg px-2 py-2 text-left text-sm transition ${
                      activeStoreId === t.storeId ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-medium">{t.storeName}</span>
                    <span className="block truncate text-xs opacity-80">{t.address}</span>
                  </button>
                ))
              )}
            </div>
            <div className="min-h-64 flex-1">
              {activeStoreId == null ? (
                <EmptyState title="Select a store" subtitle="Pick a pharmacy thread or start one from the Pharmacy page." />
              ) : visible.length === 0 ? (
                <EmptyState title="No messages yet" subtitle="Say hello below." />
              ) : (
                <div className="max-h-80 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3">
                  {visible.map((m) => (
                    <div key={m.id} className="rounded-lg bg-white p-2 text-sm">
                      <p className="font-medium text-slate-800">
                        {m.from} <span className="text-xs text-slate-500">({m.time})</span>
                      </p>
                      <p className="text-slate-600">{m.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {filter !== 'Doctors' && filter !== 'Pharmacy' && (
          <>
            {visible.length === 0 ? (
              <EmptyState title="No messages in this channel" subtitle="Try selecting a different inbox tab." />
            ) : (
              <div className="mb-3 max-h-80 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3">
                {visible.map((m) => (
                  <div key={m.id} className="rounded-lg bg-white p-2 text-sm">
                    <p className="font-medium text-slate-800">
                      {m.from} <span className="text-xs text-slate-500">({m.time})</span>
                    </p>
                    <p className="text-slate-600">{m.text}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mb-2 rounded-xl border border-dashed border-slate-300 p-3 text-sm text-slate-500">
          File upload (mock): <input type="file" />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder={threadInputDisabled ? 'Select a thread first…' : 'Type a message…'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={threadInputDisabled ? 'opacity-50' : ''}
          />
          <Button onClick={send} disabled={threadInputDisabled}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Messages
