import { StatusCodes } from 'http-status-codes'
import { env } from '../config/env.js'
import { supabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/apiError.js'
import { getPagination } from '../utils/pagination.js'

async function resolvePatientId(user) {
  if (user.role === 'patient') {
    const { data } = await supabaseAdmin.from('patients').select('id').eq('user_id', user.id).single()
    return data?.id
  }
  return null
}

export async function uploadMedicalRecord(user, file, body) {
  const patientId =
    body.patient_id || (await resolvePatientId(user)) || null

  if (!patientId) throw new ApiError(StatusCodes.BAD_REQUEST, 'patient_id is required')

  const path = `${patientId}/${Date.now()}-${file.originalname}`
  const { error: uploadErr } = await supabaseAdmin.storage
    .from(env.bucketName)
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    })
  if (uploadErr) throw new ApiError(StatusCodes.BAD_REQUEST, uploadErr.message)

  const { data: urlData } = supabaseAdmin.storage.from(env.bucketName).getPublicUrl(path)

  const { data, error } = await supabaseAdmin
    .from('medical_records')
    .insert({
      patient_id: patientId,
      doctor_id: body.doctor_id || null,
      uploaded_by: user.id,
      file_url: urlData.publicUrl,
      file_path: path,
      notes: body.notes || null,
    })
    .select('*')
    .single()

  if (error) throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  return data
}

export async function listMedicalRecords(user, query) {
  const { page, limit, from, to } = getPagination(query)
  let q = supabaseAdmin
    .from('medical_records')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  if (user.role === 'patient') {
    const pid = await resolvePatientId(user)
    q = q.eq('patient_id', pid)
  } else if (user.role === 'doctor') {
    const { data: doctor } = await supabaseAdmin.from('doctors').select('id').eq('user_id', user.id).single()
    q = q.eq('doctor_id', doctor?.id)
  }

  if (query.patient_id) q = q.eq('patient_id', query.patient_id)

  const { data, error, count } = await q
  if (error) throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  return { items: data, meta: { page, limit, total: count || 0 } }
}
