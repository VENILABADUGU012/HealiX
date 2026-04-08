import { StatusCodes } from 'http-status-codes'
import * as appointmentService from '../services/appointment.service.js'

export async function book(req, res) {
  const data = await appointmentService.bookAppointment(req.user, req.validated.body)
  return res.status(StatusCodes.CREATED).json({ success: true, data })
}

export async function cancel(req, res) {
  const data = await appointmentService.cancelAppointment(req.user, req.validated.params.id)
  return res.status(StatusCodes.OK).json({ success: true, data })
}

export async function list(req, res) {
  const data = await appointmentService.listAppointments(req.user, req.validated.query || req.query)
  return res.status(StatusCodes.OK).json({ success: true, data })
}
