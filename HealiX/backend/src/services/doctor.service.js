import { supabaseAdmin } from '../config/supabase.js'
import { getPagination } from '../utils/pagination.js'

export async function listDoctors(query) {
  const { from, to, page, limit } = getPagination(query)
  let q = supabaseAdmin
    .from('doctors')
    .select('id,user_id,specialization,availability,users(name,email,phone)', { count: 'exact' })
    .range(from, to)
    .order('created_at', { ascending: false })

  if (query.specialization) q = q.ilike('specialization', `%${query.specialization}%`)

  const { data, error, count } = await q
  if (error) throw error

  const filtered =
    query.q && query.q.trim()
      ? data.filter((d) =>
          `${d.users?.name || ''} ${d.specialization || ''}`
            .toLowerCase()
            .includes(query.q.toLowerCase()),
        )
      : data

  return { items: filtered, meta: { page, limit, total: count || 0 } }
}

export async function getDoctorById(id) {
  const { data, error } = await supabaseAdmin
    .from('doctors')
    .select('id,user_id,specialization,availability,users(name,email,phone)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getDoctorAvailability(id) {
  const { data, error } = await supabaseAdmin.from('doctors').select('id,availability').eq('id', id).single()
  if (error) throw error
  return data
}
