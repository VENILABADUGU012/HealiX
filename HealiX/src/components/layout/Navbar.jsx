import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../ui/Input'
import Button from '../ui/Button'
import NotificationContext from '../../context/notificationContextObject'
import ProfileDetailsModal from './ProfileDetailsModal'
import { getLiveSearchSuggestions } from '../../utils/searchSuggestions'
import { getAIResponse } from '../../services/aiService'
import { getRelevantChatContext, saveChatTurn } from '../../utils/chatMemoryStorage'

function formatInboxTime(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

function Navbar() {
  const navigate = useNavigate()
  const notifications = useContext(NotificationContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [aiText, setAiText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMessages, setAiMessages] = useState([{ id: 'a0', role: 'assistant', text: 'Hi! Ask me anything.' }])
  const notifRef = useRef(null)
  const aiRef = useRef(null)

  const { doctors, medicines } = useMemo(() => getLiveSearchSuggestions(searchQuery), [searchQuery])
  const showDropdown = searchQuery.trim().length > 0 && (doctors.length > 0 || medicines.length > 0)

  const inboxNotifications = notifications?.inboxNotifications ?? []
  const unreadInboxCount = notifications?.unreadInboxCount ?? 0
  const markInboxRead = notifications?.markInboxRead
  const markAllInboxRead = notifications?.markAllInboxRead

  useEffect(() => {
    if (!notifOpen) return
    const onDoc = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [notifOpen])

  useEffect(() => {
    if (!aiOpen) return
    const onDoc = (e) => {
      if (aiRef.current && !aiRef.current.contains(e.target)) setAiOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [aiOpen])

  const onSearchChange = (e) => {
    const v = e.target.value
    setSearchQuery(v)
    try {
      if (v.trim()) sessionStorage.setItem('healix_last_search_query', v)
    } catch {
      /* ignore */
    }
  }

  const goFromNotification = (n) => {
    markInboxRead?.(n.id)
    if (n.type === 'booking') navigate('/booking')
    else if (n.type === 'pharmacy') navigate('/pharmacy')
    else navigate('/messages')
    setNotifOpen(false)
  }

  const sendAiFromNavbar = async () => {
    const text = aiText.trim()
    if (!text || aiLoading) return
    const uid = `u-${Date.now()}`
    setAiMessages((prev) => [...prev, { id: uid, role: 'user', text }])
    setAiText('')
    setAiLoading(true)
    const context = getRelevantChatContext(text, 3)
    const reply = await getAIResponse(text, { short: true, context })
    saveChatTurn('navbar-ai', text, reply)
    setAiMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'assistant', text: reply }])
    setAiLoading(false)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-4 lg:px-6">
          <Link to="/home" className="text-xl font-bold text-blue-700 dark:text-blue-400">
            HealiX
          </Link>
          <div className="relative hidden w-[380px] md:block">
            <Input placeholder="Search doctors, hospitals, medicines..." value={searchQuery} onChange={onSearchChange} />
            {showDropdown ? (
              <div
                className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-lg dark:border-slate-600 dark:bg-slate-800"
                onMouseDown={(e) => e.preventDefault()}
              >
                {doctors.length > 0 ? (
                  <div className="px-2 pb-1">
                    <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Doctors</p>
                    {doctors.map((d) => (
                      <button
                        key={`d-${d}`}
                        type="button"
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-800 hover:bg-blue-50 dark:text-slate-100 dark:hover:bg-slate-700"
                        onClick={() => {
                          navigate('/booking')
                          setSearchQuery('')
                        }}
                      >
                        {d} → Booking
                      </button>
                    ))}
                  </div>
                ) : null}
                {medicines.length > 0 ? (
                  <div className="px-2 pt-1">
                    <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Medicines</p>
                    {medicines.map((m) => (
                      <button
                        key={`m-${m}`}
                        type="button"
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-800 hover:bg-emerald-50 dark:text-slate-100 dark:hover:bg-slate-700"
                        onClick={() => {
                          navigate('/pharmacy')
                          setSearchQuery('')
                        }}
                      >
                        {m} → Pharmacy
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={aiRef}>
              <button
                type="button"
                onClick={() => setAiOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                aria-label="Open AI assistant"
              >
                <span className="text-lg" aria-hidden>
                  ✨
                </span>
                <span className="hidden sm:inline">AI</span>
              </button>
              {aiOpen ? (
                <div className="absolute right-0 mt-2 w-[min(100vw-2rem,22rem)] rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-600 dark:bg-slate-800">
                  <div className="mb-2 max-h-52 space-y-2 overflow-y-auto rounded-lg bg-slate-50 p-2 dark:bg-slate-900/60">
                    {aiMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`max-w-[92%] rounded-lg px-2 py-1.5 text-xs ${
                          m.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {m.text}
                      </div>
                    ))}
                    {aiLoading ? <p className="text-xs italic text-slate-500">AI is typing...</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={aiText}
                      onChange={(e) => setAiText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendAiFromNavbar()}
                      placeholder="Ask AI..."
                      className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <Button type="button" onClick={sendAiFromNavbar} disabled={aiLoading} className="px-3 py-1.5 text-xs">
                      Send
                    </Button>
                  </div>
                  <button
                    type="button"
                    className="mt-2 w-full rounded-lg border border-slate-200 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700/50"
                    onClick={() => {
                      setAiOpen(false)
                      navigate('/ai-chat')
                    }}
                  >
                    Open full AI chat
                  </button>
                </div>
              ) : null}
            </div>
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative rounded-xl bg-slate-100 p-2 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                aria-label="Notifications"
                aria-expanded={notifOpen}
              >
                🔔
                {unreadInboxCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {unreadInboxCount > 9 ? '9+' : unreadInboxCount}
                  </span>
                ) : null}
              </button>
              {notifOpen ? (
                <div className="absolute right-0 mt-2 w-[min(100vw-2rem,22rem)] rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-600 dark:bg-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2 dark:border-slate-700">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notifications</span>
                    {inboxNotifications.some((n) => !n.read) ? (
                      <button
                        type="button"
                        className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                        onClick={() => markAllInboxRead?.()}
                      >
                        Mark all read
                      </button>
                    ) : null}
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {inboxNotifications.length === 0 ? (
                      <p className="px-3 py-6 text-center text-sm text-slate-500">No notifications yet</p>
                    ) : (
                      inboxNotifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => goFromNotification(n)}
                          className={`w-full border-b border-slate-50 px-3 py-2.5 text-left last:border-0 dark:border-slate-700/80 ${
                            n.read ? 'bg-white dark:bg-slate-800' : 'bg-blue-50/80 dark:bg-blue-950/20'
                          }`}
                        >
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{n.title}</p>
                          <p className="text-xs text-slate-600 dark:text-slate-300">{n.description}</p>
                          <p className="mt-1 text-[10px] text-slate-400">{formatInboxTime(n.time)}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <details className="relative">
              <summary className="cursor-pointer list-none rounded-xl bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">
                Profile ▾
              </summary>
              <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-600 dark:bg-slate-800">
                <button
                  type="button"
                  className="w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-100"
                  onClick={() => setDetailsOpen(true)}
                >
                  My Details
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-slate-100"
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg px-2 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  onClick={() => navigate('/login')}
                >
                  Logout
                </button>
              </div>
            </details>
          </div>
        </div>
      </header>
      <ProfileDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} />
    </>
  )
}

export default Navbar
