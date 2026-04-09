const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions'

function localFallbackResponse(input) {
  const q = String(input || '').toLowerCase()
  if (!q.trim()) return 'Please type your question and I will help.'
  if (q.includes('headache')) {
    return 'For headache: hydrate, rest, and avoid long screen exposure. You can consult a General Physician or Neurologist from Booking if symptoms persist.'
  }
  if (q.includes('fever')) {
    return 'For fever: rest, fluids, and temperature monitoring help. If fever is high or lasts more than 2-3 days, book a General Physician visit.'
  }
  if (q.includes('skin') || q.includes('acne') || q.includes('rash') || q.includes('hair')) {
    return 'For skin/hair concerns, a Dermatologist is recommended. Open Booking and filter by dermatology.'
  }
  if (q.includes('book') || q.includes('doctor') || q.includes('appointment')) {
    return 'To book: go to Booking, choose a doctor, select date/time, and confirm your appointment.'
  }
  if (q.includes('medicine') || q.includes('pharmacy') || q.includes('order')) {
    return 'For medicines: open Pharmacy, select products, place order, and track status from order details/history.'
  }
  if (q.includes('report') || q.includes('prescription') || q.includes('ocr')) {
    return 'You can scan prescriptions in Personal Health using the OCR scanner and review extracted text on Home.'
  }
  return 'I can help with appointments, medicines, messages, and health tracking. Ask about symptoms, booking doctors, or ordering medicines.'
}

export async function getAIResponse(message, options = {}) {
  const apiKey = import.meta.env.VITE_MISTRAL_API_KEY
  if (!apiKey) return localFallbackResponse(message)

  try {
    const res = await fetch(MISTRAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_MISTRAL_MODEL || 'mistral-small-latest',
        temperature: 0.4,
        max_tokens: options.short ? 120 : 350,
        messages: [
          {
            role: 'system',
            content:
              'You are a concise healthcare app assistant. Give practical, safe guidance and suggest using Booking, Pharmacy, Messages, or Personal Health when relevant.',
          },
          {
            role: 'user',
            content: [
              options.context?.length
                ? `Relevant previous chat context:\n${options.context
                    .map(
                      (c, i) =>
                        `${i + 1}) User: ${c.userText}\nAssistant: ${c.assistantText}`,
                    )
                    .join('\n\n')}\n`
                : '',
              `Current user message: ${String(message || '')}`,
            ]
              .filter(Boolean)
              .join('\n\n'),
          },
        ],
      }),
    })
    const data = await res.json()
    const out = data?.choices?.[0]?.message?.content
    if (!out || typeof out !== 'string') return localFallbackResponse(message)
    return out.trim() || localFallbackResponse(message)
  } catch {
    return localFallbackResponse(message)
  }
}
