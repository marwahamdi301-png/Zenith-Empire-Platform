import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

// Routes
import tradingRoutes from './routes/trading.js'
import walletRoutes from './routes/wallet.js'
import stakingRoutes from './routes/staking.js'

app.use('/api/trading', tradingRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/staking', stakingRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ZENITH EMPIRE ONLINE',
    network: 'Stellar Mainnet',
    timestamp: new Date().toISOString()
  })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`⚔️ ZENITH EMPIRE Backend running on port ${PORT}`)
})
