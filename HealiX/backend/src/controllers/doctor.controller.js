import { StatusCodes } from 'http-status-codes'
import * as doctorService from '../services/doctor.service.js'

export async function listDoctors(req, res) {
  const data = await doctorService.listDoctors(req.validated.query || req.query)
  return res.status(StatusCodes.OK).json({ success: true, data })
}

export async function doctorDetails(req, res) {
  const data = await doctorService.getDoctorById(req.validated.params.id)
  return res.status(StatusCodes.OK).json({ success: true, data })
}

export async function doctorAvailability(req, res) {
  const data = await doctorService.getDoctorAvailability(req.validated.params.id)
  return res.status(StatusCodes.OK).json({ success: true, data })
}
