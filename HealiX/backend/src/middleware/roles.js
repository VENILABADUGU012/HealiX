import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/apiError.js'

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Not authenticated'))
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(StatusCodes.FORBIDDEN, 'Insufficient role'))
  }
  return next()
}
