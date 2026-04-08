import { StatusCodes } from 'http-status-codes'
import { supabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/apiError.js'

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Missing bearer token'))

    const { data, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !data?.user) return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token'))

    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileErr || !profile) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User profile not found'))
    }

    req.authToken = token
    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: profile.role,
      profile,
    }
    return next()
  } catch (e) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication failed', e.message))
  }
}
