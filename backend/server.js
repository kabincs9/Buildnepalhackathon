import 'dotenv/config'
console.log("ENV TEST:", process.env.MONGO_URI);
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import destinationRoutes from './servers/routes/destinations.routes.js'
import bookingRoutes from './servers/routes/bookings.routes.js'
import authRoutes from './servers/routes/auth.routes.js'
import heritageRoutes from './servers/routes/heritageRoutes.js'
import placeRoutes from './servers/routes/placeRoutes.js'

connectDB();

const app = express()
const PORT = process.env.PORT || 5000

// CORS middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/heritage', heritageRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/destinations', destinationRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/auth', authRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`✅ tourism-nepal backend running on http://localhost:${PORT}`)
})