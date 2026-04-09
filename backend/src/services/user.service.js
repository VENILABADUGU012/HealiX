import { StatusCodes } from 'http-status-codes'
import { supabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/apiError.js'

export async function getProfile(userId) {
  const { data, error } = await supabaseAdmin.from('users').select('*').eq('id', userId).single()
  if (error || !data) throw new ApiError(StatusCodes.NOT_FOUND, 'Profile not found')
  return data
}

export async function updateProfile(userId, payload) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select('*')
    .single()
  if (error || !data) throw new ApiError(StatusCodes.BAD_REQUEST, error?.message || 'Update failed')
  return data
}
