import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller.js';

const router = Router();
const walletController = new WalletController();

router.get('/balance/:address', walletController.getBalance);
router.get('/transactions/:address', walletController.getTransactions);
router.post('/send', walletController.sendPayment);

export default router;
