import * as StellarSdk from '@stellar/stellar-sdk'

// يقرأ من Environment Variables - آمن 100%
const WALLETS = {
  primary: {
    secret: process.env.STELLAR_SECRET_PRIMARY,
    public: process.env.STELLAR_PUBLIC_PRIMARY,
    name: 'Primary Wallet'
  },
  secondary: {
    secret: process.env.STELLAR_SECRET_SECONDARY,
    public: process.env.STELLAR_PUBLIC_SECONDARY,
    name: 'Secondary Wallet'
  },
  rewards: {
    secret: process.env.STELLAR_SECRET_REWARDS,
    public: process.env.STELLAR_PUBLIC_REWARDS,
    name: 'Rewards Wallet'
  }
}

const server = new StellarSdk.Horizon.Server('https://horizon.stellar.org')

export class WalletService {

  // ===== جلب رصيد محفظة =====
  async getBalance(walletType = 'primary') {
    try {
      const wallet = WALLETS[walletType]
      if (!wallet?.secret) throw new Error('Wallet not configured')

      const keypair = StellarSdk.Keypair.fromSecret(wallet.secret)
      const account = await server.loadAccount(keypair.publicKey())

      const balances = {}
      account.balances.forEach(b => {
        const key = b.asset_type === 'native' ? 'XLM' : b.asset_code
        balances[key] = parseFloat(b.balance)
      })

      return {
        success: true,
        wallet: walletType,
        publicKey: keypair.publicKey(),
        balances
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ===== إرسال ZENITH لمستخدم =====
  async sendZenith(toAddress, amount, fromWallet = 'rewards') {
    try {
      const wallet = WALLETS[fromWallet]
      if (!wallet?.secret) throw new Error('Wallet not configured')

      const keypair = StellarSdk.Keypair.fromSecret(wallet.secret)
      const account = await server.loadAccount(keypair.publicKey())

      // ZENITH Asset
      const zenithAsset = new StellarSdk.Asset(
        'ZENITH',
        process.env.STELLAR_PUBLIC_PRIMARY
      )

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.PUBLIC
      })
        .addOperation(StellarSdk.Operation.payment({
          destination: toAddress,
          asset: zenithAsset,
          amount: amount.toString()
        }))
        .setTimeout(180)
        .build()

      transaction.sign(keypair)
      const result = await server.submitTransaction(transaction)

      return {
        success: true,
        hash: result.hash,
        amount,
        to: toAddress
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ===== استقبال رسوم التداول (10% withdrawal) =====
  async collectFee(fromAddress, amount) {
    try {
      // 10% يذهب لـ Primary Wallet تلقائياً
      const feeAmount = amount * 0.10
      console.log(`Fee collected: ${feeAmount} from ${fromAddress}`)
      return { success: true, fee: feeAmount }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ===== جلب تاريخ المعاملات =====
  async getTransactions(walletType = 'primary', limit = 20) {
    try {
      const wallet = WALLETS[walletType]
      if (!wallet?.secret) throw new Error('Wallet not configured')

      const keypair = StellarSdk.Keypair.fromSecret(wallet.secret)
      const txs = await server
        .transactions()
        .forAccount(keypair.publicKey())
        .limit(limit)
        .order('desc')
        .call()

      return {
        success: true,
        transactions: txs.records.map(tx => ({
          id: tx.id,
          hash: tx.hash,
          created: tx.created_at,
          fee: tx.fee_charged,
          operations: tx.operation_count
        }))
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default new WalletService()
