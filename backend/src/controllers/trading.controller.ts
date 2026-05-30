import { Request, Response } from 'express';
import { TradingService } from '../services/trading.service.js';

export class TradingController {
  private tradingService = new TradingService();

  getOrderBook = async (req: Request, res: Response) => {
    try {
      const { pair } = req.params;
      const orderBook = await this.tradingService.getOrderBook(pair);
      res.json({ success: true, data: orderBook });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  getRecentTrades = async (req: Request, res: Response) => {
    try {
      const { pair } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;
      const trades = await this.tradingService.getRecentTrades(pair, limit);
      res.json({ success: true, data: trades });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  placeOrder = async (req: Request, res: Response) => {
    try {
      const { pair, side, type, price, amount } = req.body;
      const order = await this.tradingService.placeOrder({ pair, side, type, price, amount });
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
