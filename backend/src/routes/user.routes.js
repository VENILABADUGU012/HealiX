import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { updateProfileSchema } from '../models/schemas.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as userController from '../controllers/user.controller.js'

const router = Router()

router.get('/profile', requireAuth, asyncHandler(userController.getProfile))
router.patch('/profile', requireAuth, validate(updateProfileSchema), asyncHandler(userController.updateProfile))

export default router
