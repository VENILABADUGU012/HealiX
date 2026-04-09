import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as notificationController from '../controllers/notification.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { allowRoles } from '../middleware/roles.js'
import { validate } from '../middleware/validate.js'
import { notificationCreateSchema } from '../models/schemas.js'

const router = Router()

router.post(
  '/',
  requireAuth,
  allowRoles('admin', 'doctor'),
  validate(notificationCreateSchema),
  asyncHandler(notificationController.create),
)
router.get('/', requireAuth, asyncHandler(notificationController.list))

export default router
