import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import routes from './routes/index.js'
import { env } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import { swaggerSpec } from './docs/swagger.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  }),
)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/v1', routes)
app.use(notFound)
app.use(errorHandler)

export default app
