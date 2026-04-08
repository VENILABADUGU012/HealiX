import { Router } from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import doctorRoutes from './doctor.routes.js'
import appointmentRoutes from './appointment.routes.js'
import medicalRecordRoutes from './medicalRecord.routes.js'
import notificationRoutes from './notification.routes.js'

const router = Router()

router.get('/health', (_req, res) => res.json({ success: true, data: { service: 'healix-backend' } }))
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/doctors', doctorRoutes)
router.use('/appointments', appointmentRoutes)
router.use('/medical-records', medicalRecordRoutes)
router.use('/notifications', notificationRoutes)

export default router
