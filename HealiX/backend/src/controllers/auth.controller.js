import { StatusCodes } from 'http-status-codes'
import * as authService from '../services/auth.service.js'

export async function signup(req, res) {
  const out = await authService.signup(req.validated.body)
  return res.status(StatusCodes.CREATED).json({ success: true, data: out })
}

export async function login(req, res) {
  const out = await authService.login(req.validated.body)
  return res.status(StatusCodes.OK).json({ success: true, data: out })
}

export async function logout(req, res) {
  const out = await authService.logout(req.authToken)
  return res.status(StatusCodes.OK).json({ success: true, data: out })
}

export async function currentUser(req, res) {
  return res.status(StatusCodes.OK).json({ success: true, data: req.user })
}
