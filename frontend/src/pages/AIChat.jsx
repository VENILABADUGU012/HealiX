import { useEffect, useMemo, useRef, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import PageHeader from '../components/common/PageHeader'
import { getAIResponse } from '../services/aiService'
import { getRelevantChatContext, saveChatTurn } from '../utils/chatMemoryStorage'

let msgId = 0
function nextId() {
  msgId += 1
  return `m-${msgId}`
}

function AIChat() {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([
    {
      id: nextId(),
      role: 'assistant',
      content: 'Hi! Ask about symptoms (e.g. headache, fever, skin), or say book / medicine for navigation help.',
    },
  ])
  const bottomRef = useRef(null)

  const isBusy = useMemo(
    () => messages.some((m) => m.role === 'assistant' && m.content === 'Thinking...'),
    [messages],
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const userText = text.trim()
    if (!userText || isBusy) return

    const userMessage = { id: nextId(), role: 'user', content: userText }
    const thinkingId = nextId()
    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: thinkingId, role: 'assistant', content: 'Thinking...' },
    ])
    setText('')

    const context = getRelevantChatContext(userText, 4)
    const reply = await getAIResponse(userText, { context })
    saveChatTurn('ai-chat', userText, reply)
    setMessages((prev) => {
      const updated = [...prev]
      updated.pop()
      updated.push({
        id: nextId(),
        role: 'assistant',
        content: reply,
      })
      return updated
    })
  }

  return (
    <div className="space-y-4">
      <PageHeader title="AI Chat" subtitle="Guidance for Booking, Pharmacy, and general wellness pointers — not a diagnosis." />
      <Card className="shadow-md">
        <p className="mb-3 text-xs text-amber-800 dark:text-amber-200/90">This is not a medical diagnosis. For emergencies, contact local services.</p>
        <div className="mb-3 max-h-[min(70vh,28rem)] space-y-3 overflow-y-auto rounded-xl bg-slate-50 p-4 dark:bg-slate-900/60">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-800 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-600'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          <span ref={bottomRef} />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="e.g. headache, fever, book a doctor, order medicine…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button type="button" onClick={handleSend} disabled={isBusy} className="shrink-0 sm:min-w-[96px]">
            Send
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default AIChat
