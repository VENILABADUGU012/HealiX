export function getPagination(query) {
  const page = Math.max(1, Number(query.page || 1))
  const limit = Math.min(100, Math.max(1, Number(query.limit || 10)))
  const from = (page - 1) * limit
  const to = from + limit - 1
  return { page, limit, from, to }
}
