import { Router } from 'express'
import multer from 'multer'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as medicalRecordController from '../controllers/medicalRecord.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

router.post('/upload', requireAuth, upload.single('file'), asyncHandler(medicalRecordController.upload))
router.get('/', requireAuth, asyncHandler(medicalRecordController.list))

export default router
