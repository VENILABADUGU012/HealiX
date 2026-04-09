const CHAT_MEMORY_KEY = 'healix_chat_memory_v1'

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2)
}

function overlapScore(aTokens, bTokens) {
  if (!aTokens.length || !bTokens.length) return 0
  const a = new Set(aTokens)
  const b = new Set(bTokens)
  let match = 0
  a.forEach((t) => {
    if (b.has(t)) match += 1
  })
  return match / Math.max(1, Math.sqrt(a.size * b.size))
}

function loadRaw() {
  try {
    const raw = JSON.parse(localStorage.getItem(CHAT_MEMORY_KEY) || '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

function saveRaw(list) {
  localStorage.setItem(CHAT_MEMORY_KEY, JSON.stringify(list.slice(0, 300)))
}

export function saveChatTurn(source, userText, assistantText) {
  const list = loadRaw()
  list.unshift({
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    source,
    userText: String(userText || ''),
    assistantText: String(assistantText || ''),
    at: new Date().toISOString(),
  })
  saveRaw(list)
}

export function getRelevantChatContext(message, limit = 4) {
  const q = tokenize(message)
  if (!q.length) return []
  return loadRaw()
    .map((row) => ({
      row,
      score: overlapScore(q, tokenize(`${row.userText} ${row.assistantText}`)),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.row)
}
