import { z } from 'zod'

export const signupSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(['patient', 'doctor', 'admin']).default('patient'),
    name: z.string().min(2),
    phone: z.string().min(8).max(20).optional(),
    specialization: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
})

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(8).max(20).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
})

export const doctorListQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    specialization: z.string().optional(),
    q: z.string().optional(),
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
})

export const idParamSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({}).optional(),
  query: z.object({}).optional(),
})

export const bookAppointmentSchema = z.object({
  body: z.object({
    doctor_id: z.string().uuid(),
    scheduled_at: z.string().datetime(),
    mode: z.enum(['online', 'offline']),
    notes: z.string().max(2000).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
})

export const appointmentListQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional(),
})

export const notificationCreateSchema = z.object({
  body: z.object({
    user_id: z.string().uuid(),
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(500),
    type: z.enum(['booking', 'pharmacy', 'message', 'system']),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
})
