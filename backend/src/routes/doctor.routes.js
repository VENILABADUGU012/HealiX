import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as doctorController from '../controllers/doctor.controller.js'
import { validate } from '../middleware/validate.js'
import { doctorListQuerySchema, idParamSchema } from '../models/schemas.js'

const router = Router()

router.get('/', validate(doctorListQuerySchema), asyncHandler(doctorController.listDoctors))
router.get('/:id', validate(idParamSchema), asyncHandler(doctorController.doctorDetails))
router.get('/:id/availability', validate(idParamSchema), asyncHandler(doctorController.doctorAvailability))

export default router
