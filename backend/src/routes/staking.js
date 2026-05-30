import { Router } from 'express'
import StakingService from '../services/staking.service.js'

const router = Router()

// كل البولات
router.get('/pools', (req, res) => {
  res.json(StakingService.getPools())
})

// إيداع
router.post('/stake', async (req, res) => {
  const { userId, amount, poolId } = req.body
  const result = await StakingService.stake(userId, amount, poolId)
  res.json(result)
})

// Rewards
router.get('/rewards/:userId', async (req, res) => {
  const result = await StakingService.getRewards(req.params.userId)
  res.json(result)
})

export default router
