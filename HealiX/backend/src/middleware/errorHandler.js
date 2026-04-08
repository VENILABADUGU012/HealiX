import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/apiError.js'

export function errorHandler(err, _req, res, _next) {
  const status = err instanceof ApiError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR
  const message = err instanceof ApiError ? err.message : 'Internal server error'
  const details = err instanceof ApiError ? err.details : undefined

  return res.status(status).json({
    success: false,
    error: {
      code: status,
      message,
      details,
    },
  })
}
