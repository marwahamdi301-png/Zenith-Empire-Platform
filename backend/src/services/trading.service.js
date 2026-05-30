import WalletService from './wallet.service.js'

// Order Book في الذاكرة (Redis في الإنتاج)
const orderBook = {
  bids: [], // شراء
  asks: []  // بيع
}

// آخر الصفقات
const recentTrades = []

// أسعار ZNT
let currentPrice = 0.047236

export class TradingService {

  // ===== وضع أمر شراء =====
  async placeBuyOrder(userId, amount, price) {
    try {
      if (amount <= 0) throw new Error('INVALID_AMOUNT')
      if (price <= 0) throw new Error('INVALID_PRICE')

      const order = {
        id: Date.now().toString(),
        userId,
        type: 'BUY',
        amount: parseFloat(amount),
        price: parseFloat(price),
        total: amount * price,
        fee: amount * price * 0.001, // 0.1% رسوم
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }

      // مطابقة الأوامر
      const matched = this.matchOrder(order, 'BUY')

      if (matched) {
        order.status = 'FILLED'
        recentTrades.unshift({
          ...order,
          executedAt: new Date().toISOString()
        })

        // تحديث السعر الحالي
        currentPrice = order.price
      } else {
        orderBook.bids.push(order)
        orderBook.bids.sort((a, b) => b.price - a.price)
        order.status = 'OPEN'
      }

      return { success: true, order }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ===== وضع أمر بيع =====
  async placeSellOrder(userId, amount, price) {
    try {
      if (amount <= 0) throw new Error('INVALID_AMOUNT')
      if (price <= 0) throw new Error('INVALID_PRICE')

      const order = {
        id: Date.now().toString(),
        userId,
        type: 'SELL',
        amount: parseFloat(amount),
        price: parseFloat(price),
        total: amount * price,
        fee: amount * 0.001, // 0.1% رسوم
        status: 'PENDING',
        createdAt: new Date().toISOString()
      }

      const matched = this.matchOrder(order, 'SELL')

      if (matched) {
        order.status = 'FILLED'
        recentTrades.unshift({
          ...order,
          executedAt: new Date().toISOString()
        })
        currentPrice = order.price
      } else {
        orderBook.asks.push(order)
        orderBook.asks.sort((a, b) => a.price - b.price)
        order.status = 'OPEN'
      }

      return { success: true, order }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ===== مطابقة الأوامر =====
  matchOrder(order, type) {
    if (type === 'BUY') {
      const matchingAsk = orderBook.asks.find(ask => ask.price <= order.price)
      if (matchingAsk) {
        orderBook.asks = orderBook.asks.filter(a => a.id !== matchingAsk.id)
        return true
      }
    } else {
      const matchingBid = orderBook.bids.find(bid => bid.price >= order.price)
      if (matchingBid) {
        orderBook.bids = orderBook.bids.filter(b => b.id !== matchingBid.id)
        return true
      }
    }
    return false
  }

  // ===== جلب Order Book =====
  getOrderBook() {
    return {
      success: true,
      price: currentPrice,
      bids: orderBook.bids.slice(0, 15).map(o => ({
        price: o.price.toFixed(6),
        amount: o.amount,
        total: o.total.toFixed(2)
      })),
      asks: orderBook.asks.slice(0, 15).map(o => ({
        price: o.price.toFixed(6),
        amount: o.amount,
        total: o.total.toFixed(2)
      }))
    }
  }

  // ===== جلب آخر الصفقات =====
  getRecentTrades(limit = 20) {
    return {
      success: true,
      trades: recentTrades.slice(0, limit)
    }
  }

  // ===== السعر الحالي =====
  getCurrentPrice() {
    // تحديث السعر بشكل واقعي
    const change = (Math.random() - 0.49) * 0.0005
    currentPrice = Math.max(0.03, currentPrice + change)
    return {
      success: true,
      price: currentPrice,
      change24h: 2.45,
      volume24h: 2100000,
      high24h: 0.0595,
      low24h: 0.0325
    }
  }
}

export default new TradingService()
