require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const paymentRoutes = require('./routes/payment')
const authRoutes = require('./routes/auth')

const app = express()

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Update to Vercel URL in prod
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'x-auth-token',
    'x-paystack-signature',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// Parse raw body for webhook
app.use(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' })
)
app.use(express.json())

connectDB()

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

app.use('/api/payment', paymentRoutes)
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
)
