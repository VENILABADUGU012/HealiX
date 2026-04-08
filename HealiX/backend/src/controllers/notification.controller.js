import { StatusCodes } from 'http-status-codes'
import * as notificationService from '../services/notification.service.js'

export async function create(req, res) {
  const data = await notificationService.createNotification(req.validated.body)
  return res.status(StatusCodes.CREATED).json({ success: true, data })
}

export async function list(req, res) {
  const data = await notificationService.listNotifications(req.user, req.query)
  return res.status(StatusCodes.OK).json({ success: true, data })
}
