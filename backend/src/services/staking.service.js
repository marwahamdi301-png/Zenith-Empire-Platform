import WalletService from './wallet.service.js'

const stakingPools = {
  '30d':  { apy: 18, minAmount: 1000,  lockDays: 30  },
  '90d':  { apy: 20, minAmount: 5000,  lockDays: 90  },
  '180d': { apy: 22, minAmount: 10000, lockDays: 180 },
  '365d': { apy: 24, minAmount: 50000, lockDays: 365 }
}

const activeStakes = new Map()

export class StakingService {

  // ===== إيداع في Staking Pool =====
  async stake(userId, amount, poolId) {
    try {
      const pool = stakingPools[poolId]
      if (!pool) throw new Error('INVALID_POOL')
      if (amount < pool.minAmount) {
        throw new Error(`MINIMUM_AMOUNT: ${pool.minAmount} ZNT required`)
      }

      const stake = {
        id: `${userId}-${Date.now()}`,
        userId,
        poolId,
        amount: parseFloat(amount),
        apy: pool.apy,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + pool.lockDays * 86400000).toISOString(),
        expectedReward: amount * (pool.apy / 100) * (pool.lockDays / 365),
        status: 'ACTIVE'
      }

      const userStakes = activeStakes.get(userId) || []
      userStakes.push(stake)
      activeStakes.set(userId, userStakes)

      return {
        success: true,
        stake,
        message: `Staked ${amount} ZNT for ${pool.lockDays} days at ${pool.apy}% APY`
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ===== جلب Staking Rewards =====
  async getRewards(userId) {
    try {
      const userStakes = activeStakes.get(userId) || []
      let totalRewards = 0

      const stakes = userStakes.map(stake => {
        const elapsed = Date.now() - new Date(stake.startDate).getTime()
        const elapsedDays = elapsed / 86400000
        const pool = stakingPools[stake.poolId]
        const earned = stake.amount * (pool.apy / 100) * (elapsedDays / 365)
        totalRewards += earned

        return {
          ...stake,
          earnedSoFar: earned.toFixed(4),
          daysRemaining: Math.max(0, pool.lockDays - Math.floor(elapsedDays))
        }
      })

      return {
        success: true,
        stakes,
        totalRewards: totalRewards.toFixed(4),
        totalStaked: userStakes.reduce((s, st) => s + st.amount, 0)
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ===== جلب كل البولات =====
  getPools() {
    return {
      success: true,
      pools: Object.entries(stakingPools).map(([id, pool]) => ({
        id,
        ...pool,
        tvl: Math.floor(Math.random() * 5000000 + 1000000)
      }))
    }
  }
}

export default new StakingService()
