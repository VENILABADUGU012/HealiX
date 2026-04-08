import { StatusCodes } from 'http-status-codes'
import * as medicalRecordService from '../services/medicalRecord.service.js'

export async function upload(req, res) {
  const data = await medicalRecordService.uploadMedicalRecord(req.user, req.file, req.body)
  return res.status(StatusCodes.CREATED).json({ success: true, data })
}

export async function list(req, res) {
  const data = await medicalRecordService.listMedicalRecords(req.user, req.query)
  return res.status(StatusCodes.OK).json({ success: true, data })
}
