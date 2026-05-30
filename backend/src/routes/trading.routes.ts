import { Router } from 'express';
import { TradingController } from '../controllers/trading.controller.js';

const router = Router();
const tradingController = new TradingController();

router.get('/orderbook/:pair', tradingController.getOrderBook);
router.get('/trades/:pair', tradingController.getRecentTrades);
router.post('/order', tradingController.placeOrder);

export default router;

import { StellarTradingController } from '../controllers/stellar-trading.controller.js';

const stellarController = new StellarTradingController();
router.post('/execute', stellarController.executeTrade);
router.get('/balances', stellarController.getBalances);

import { StellarTradingController } from '../controllers/stellar-trading.controller.js';

const stellarController = new StellarTradingController();
router.post('/execute', stellarController.executeTrade);
router.get('/balances', stellarController.getBalances);
