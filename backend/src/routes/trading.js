import { Router } from 'express'
import TradingService from '../services/trading.service.js'

const router = Router()

// السعر الحالي
router.get('/price', (req, res) => {
  res.json(TradingService.getCurrentPrice())
})

// Order Book
router.get('/orderbook', (req, res) => {
  res.json(TradingService.getOrderBook())
})

// آخر الصفقات
router.get('/trades', (req, res) => {
  res.json(TradingService.getRecentTrades())
})

// أمر شراء
router.post('/buy', async (req, res) => {
  const { userId, amount, price } = req.body
  const result = await TradingService.placeBuyOrder(userId, amount, price)
  res.json(result)
})

// أمر بيع
router.post('/sell', async (req, res) => {
  const { userId, amount, price } = req.body
  const result = await TradingService.placeSellOrder(userId, amount, price)
  res.json(result)
})

export default router
