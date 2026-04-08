import { StatusCodes } from 'http-status-codes'
import { supabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/apiError.js'
import { getPagination } from '../utils/pagination.js'

async function getPatientIdByUserId(userId) {
  const { data } = await supabaseAdmin.from('patients').select('id').eq('user_id', userId).single()
  return data?.id
}

async function getDoctorIdByUserId(userId) {
  const { data } = await supabaseAdmin.from('doctors').select('id').eq('user_id', userId).single()
  return data?.id
}

export async function bookAppointment(user, payload) {
  if (user.role !== 'patient') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only patients can book appointments')
  }
  const patientId = await getPatientIdByUserId(user.id)
  if (!patientId) throw new ApiError(StatusCodes.BAD_REQUEST, 'Patient profile missing')

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .insert({
      doctor_id: payload.doctor_id,
      patient_id: patientId,
      scheduled_at: payload.scheduled_at,
      mode: payload.mode,
      status: 'scheduled',
      notes: payload.notes || null,
    })
    .select('*')
    .single()
  if (error) throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  return data
}

export async function cancelAppointment(user, appointmentId) {
  const { data: appointment, error } = await supabaseAdmin
    .from('appointments')
    .select('*')
    .eq('id', appointmentId)
    .single()
  if (error || !appointment) throw new ApiError(StatusCodes.NOT_FOUND, 'Appointment not found')

  if (user.role === 'patient') {
    const patientId = await getPatientIdByUserId(user.id)
    if (!patientId || appointment.patient_id !== patientId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Not your appointment')
    }
  } else if (user.role === 'doctor') {
    const doctorId = await getDoctorIdByUserId(user.id)
    if (!doctorId || appointment.doctor_id !== doctorId) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Not your appointment')
    }
  }

  const { data, error: upErr } = await supabaseAdmin
    .from('appointments')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', appointmentId)
    .select('*')
    .single()
  if (upErr) throw new ApiError(StatusCodes.BAD_REQUEST, upErr.message)
  return data
}

export async function listAppointments(user, query) {
  const { page, limit, from, to } = getPagination(query)
  let base = supabaseAdmin
    .from('appointments')
    .select('*, doctors(id,specialization,user_id,users(name)), patients(id,user_id,users(name))', {
      count: 'exact',
    })
    .range(from, to)
    .order('scheduled_at', { ascending: true })

  if (query.status) base = base.eq('status', query.status)

  if (user.role === 'patient') {
    const patientId = await getPatientIdByUserId(user.id)
    base = base.eq('patient_id', patientId)
  } else if (user.role === 'doctor') {
    const doctorId = await getDoctorIdByUserId(user.id)
    base = base.eq('doctor_id', doctorId)
  }

  const { data, error, count } = await base
  if (error) throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  return { items: data, meta: { page, limit, total: count || 0 } }
}
