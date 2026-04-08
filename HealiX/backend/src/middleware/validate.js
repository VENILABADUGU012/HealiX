import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/apiError.js'

export const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  })
  if (!parsed.success) {
    return next(
      new ApiError(StatusCodes.BAD_REQUEST, 'Validation failed', parsed.error.flatten()),
    )
  }
  req.validated = parsed.data
  return next()
}
