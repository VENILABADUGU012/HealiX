import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as appointmentController from '../controllers/appointment.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import {
  appointmentListQuerySchema,
  bookAppointmentSchema,
  idParamSchema,
} from '../models/schemas.js'

const router = Router()

router.post('/', requireAuth, validate(bookAppointmentSchema), asyncHandler(appointmentController.book))
router.patch('/:id/cancel', requireAuth, validate(idParamSchema), asyncHandler(appointmentController.cancel))
router.get('/', requireAuth, validate(appointmentListQuerySchema), asyncHandler(appointmentController.list))

export default router
