// staking.service.js
// ⚠️ Staking غير مفعّل حاليًا. هذا الملف يرجّع استجابات صادقة بدل بيانات وهمية،
// إلى حين بناء نظام حقيقي مبني على قاعدة بيانات دائمة ومصدر عائد حقيقي
// متكامل فعليًا مع WalletService لتنفيذ معاملات Stellar.

const stakingPools = {
  '30d':  { apy: 18, minAmount: 1000,  lockDays: 30  },
  '90d':  { apy: 20, minAmount: 5000,  lockDays: 90  },
  '180d': { apy: 22, minAmount: 10000, lockDays: 180 },
  '365d': { apy: 24, minAmount: 50000, lockDays: 365 }
}

export class StakingService {

  // ===== إيداع في Staking Pool =====
  async stake(userId, amount, poolId) {
    return {
      success: false,
      error: 'STAKING_NOT_AVAILABLE',
      message: 'خدمة Staking غير متاحة حاليًا. المنصة قيد التطوير في هذا الجزء.'
    }
  }

  // ===== جلب Staking Rewards =====
  async getRewards(userId) {
    return {
      success: false,
      error: 'STAKING_NOT_AVAILABLE',
      message: 'خدمة Staking غير متاحة حاليًا. المنصة قيد التطوير في هذا الجزء.',
      stakes: [],
      totalRewards: '0.0000',
      totalStaked: 0
    }
  }

  // ===== جلب كل البولات (معلومات العرض فقط - بدون TVL وهمي) =====
  getPools() {
    return {
      success: true,
      available: false,
      message: 'خدمة Staking قيد التطوير حاليًا. التفاصيل أدناه للعرض فقط ولا تمثل بيانات حية.',
      pools: Object.entries(stakingPools).map(([id, pool]) => ({
        id,
        apy: pool.apy,
        minAmount: pool.minAmount,
        lockDays: pool.lockDays
        // TVL محذوف عمدًا لأنه كان يُولَّد عشوائيًا (Math.random) في النسخة السابقة
      }))
    }
  }
}

export default new StakingService()
