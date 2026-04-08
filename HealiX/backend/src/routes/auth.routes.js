import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as authController from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { loginSchema, signupSchema } from '../models/schemas.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/signup', validate(signupSchema), asyncHandler(authController.signup))
router.post('/login', validate(loginSchema), asyncHandler(authController.login))
router.post('/logout', requireAuth, asyncHandler(authController.logout))
router.get('/me', requireAuth, asyncHandler(authController.currentUser))

export default router
