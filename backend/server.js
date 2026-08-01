  import 'dotenv/config'
  import express from 'express'
  import cors from 'cors'
  import morgan from 'morgan'


  import { errorHandler } from "./middleware/errorHandler.js";
  import destinationRoutes from './servers/routes/destinations.routes.js'
  import bookingRoutes from './servers/routes/bookings.routes.js'
  import authRoutes from './servers/routes/auth.routes.js'
  import heritageRoutes from './servers/routes/heritageRoutes.js'
  import placeRoutes from './servers/routes/placeRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use('/api/heritage', heritageRoutes);
app.use('/api/places', placeRoutes);

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
