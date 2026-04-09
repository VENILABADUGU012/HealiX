import { StatusCodes } from 'http-status-codes'
import { supabaseAdmin, supabaseAuth } from '../config/supabase.js'
import { ApiError } from '../utils/apiError.js'

export async function signup(payload) {
  const { email, password, role, name, phone, specialization } = payload

  const { data, error } = await supabaseAuth.auth.signUp({
    email,
    password,
    options: { data: { role } },
  })
  if (error || !data.user) throw new ApiError(StatusCodes.BAD_REQUEST, error?.message || 'Signup failed')

  const userRow = {
    id: data.user.id,
    role,
    name,
    email,
    phone: phone || null,
  }
  const { error: profileError } = await supabaseAdmin.from('users').insert(userRow)
  if (profileError) throw new ApiError(StatusCodes.BAD_REQUEST, profileError.message)

  if (role === 'doctor') {
    const { error: doctorErr } = await supabaseAdmin.from('doctors').insert({
      user_id: data.user.id,
      specialization: specialization || 'General Medicine',
      availability: {},
    })
    if (doctorErr) throw new ApiError(StatusCodes.BAD_REQUEST, doctorErr.message)
  } else if (role === 'patient') {
    const { error: patientErr } = await supabaseAdmin.from('patients').insert({ user_id: data.user.id })
    if (patientErr) throw new ApiError(StatusCodes.BAD_REQUEST, patientErr.message)
  }

  return { user: data.user, session: data.session }
}

export async function login(payload) {
  const { data, error } = await supabaseAuth.auth.signInWithPassword(payload)
  if (error || !data.session) throw new ApiError(StatusCodes.UNAUTHORIZED, error?.message || 'Login failed')
  return data
}

export async function logout(token) {
  if (!token) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing auth token')
  return { ok: true }
}
