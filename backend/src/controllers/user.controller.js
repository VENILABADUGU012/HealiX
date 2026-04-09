import { StatusCodes } from 'http-status-codes'
import * as userService from '../services/user.service.js'

export async function getProfile(req, res) {
  const data = await userService.getProfile(req.user.id)
  return res.status(StatusCodes.OK).json({ success: true, data })
}

export async function updateProfile(req, res) {
  const data = await userService.updateProfile(req.user.id, req.validated.body)
  return res.status(StatusCodes.OK).json({ success: true, data })
}
