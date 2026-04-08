import { StatusCodes } from 'http-status-codes'

export function notFound(req, res) {
  return res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  })
}
