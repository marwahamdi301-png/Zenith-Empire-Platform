import { Request, Response } from 'express';
import { StellarService } from '../services/stellar.service.js';

export class WalletController {
  private stellarService = new StellarService();

  getBalance = async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      const balance = await this.stellarService.getAccountBalance(address);
      res.json({ success: true, data: balance });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  getTransactions = async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await this.stellarService.getTransactions(address, limit);
      res.json({ success: true, data: transactions });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  sendPayment = async (req: Request, res: Response) => {
    try {
      const { source, destination, amount, memo } = req.body;
      const result = await this.stellarService.sendPayment(source, destination, amount, memo);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };
}
