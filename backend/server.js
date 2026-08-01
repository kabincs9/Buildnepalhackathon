import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import destinationRoutes from './routes/destinations.routes.js'
import bookingRoutes from './routes/bookings.routes.js'
import authRoutes from './routes/auth.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/destinations', destinationRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/auth', authRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`tourism-nepal backend running on http://localhost:${PORT}`)
})
