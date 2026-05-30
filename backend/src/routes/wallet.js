import { Router } from 'express'
import WalletService from '../services/wallet.service.js'

const router = Router()

// رصيد المحفظة
router.get('/balance/:type', async (req, res) => {
  const result = await WalletService.getBalance(req.params.type)
  res.json(result)
})

// إرسال ZENITH
router.post('/send', async (req, res) => {
  const { to, amount, from } = req.body
  const result = await WalletService.sendZenith(to, amount, from)
  res.json(result)
})

// تاريخ المعاملات
router.get('/transactions/:type', async (req, res) => {
  const result = await WalletService.getTransactions(req.params.type)
  res.json(result)
})

export default router
