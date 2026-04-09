import { StatusCodes } from 'http-status-codes'
import { supabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/apiError.js'
import { getPagination } from '../utils/pagination.js'

export async function createNotification(payload) {
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: payload.user_id,
      title: payload.title,
      description: payload.description,
      type: payload.type,
      read: false,
    })
    .select('*')
    .single()
  if (error) throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  return data
}

export async function listNotifications(user, query) {
  const { page, limit, from, to } = getPagination(query)
  let q = supabaseAdmin
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .range(from, to)
    .order('created_at', { ascending: false })

  if (query.read === 'true') q = q.eq('read', true)
  if (query.read === 'false') q = q.eq('read', false)

  const { data, error, count } = await q
  if (error) throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  return { items: data, meta: { page, limit, total: count || 0 } }
}
