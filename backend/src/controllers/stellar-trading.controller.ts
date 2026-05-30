import { Request, Response } from 'express';
import * as StellarSdk from '@stellar/stellar-sdk';

const SECRETS = {
  primary: process.env.STELLAR_SECRET_PRIMARY!,
  secondary: process.env.STELLAR_SECRET_SECONDARY!,
  rewards: process.env.STELLAR_SECRET_REWARDS!,
};

export class StellarTradingController {
  private server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');

  executeTrade = async (req: Request, res: Response) => {
    try {
      const { walletType, destination, amount, assetCode } = req.body;
      
      const secretKey = SECRETS[walletType as keyof typeof SECRETS];
      if (!secretKey) {
        return res.status(400).json({ error: 'Invalid wallet type' });
      }

      const keypair = StellarSdk.Keypair.fromSecret(secretKey);
      const account = await this.server.loadAccount(keypair.publicKey());

      const asset = assetCode === 'XLM' 
        ? StellarSdk.Asset.native()
        : new StellarSdk.Asset(assetCode, destination);

      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.PUBLIC,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination,
            asset,
            amount: amount.toString(),
          })
        )
        .setTimeout(180)
        .build();

      transaction.sign(keypair);
      const result = await this.server.submitTransaction(transaction);

      res.json({
        success: true,
        hash: result.hash,
        ledger: result.ledger,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getBalances = async (req: Request, res: Response) => {
    try {
      const balances = await Promise.all(
        Object.entries(SECRETS).map(async ([type, secret]) => {
          const keypair = StellarSdk.Keypair.fromSecret(secret);
          const account = await this.server.loadAccount(keypair.publicKey());
          
          return {
            type,
            publicKey: keypair.publicKey(),
            balances: account.balances,
          };
        })
      );

      res.json({ success: true, data: balances });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
