import * as StellarSdk from '@stellar/stellar-sdk';

export class StellarService {
  private server: StellarSdk.Horizon.Server;
  private network: string;

  constructor() {
    const horizonUrl = process.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
    this.server = new StellarSdk.Horizon.Server(horizonUrl);
    this.network = process.env.VITE_STELLAR_NETWORK || 'testnet';
  }

  async getAccountBalance(address: string) {
    const account = await this.server.loadAccount(address);
    return account.balances.map(balance => ({
      asset_type: balance.asset_type,
      asset_code: 'asset_code' in balance ? balance.asset_code : 'XLM',
      balance: balance.balance,
    }));
  }

  async getTransactions(address: string, limit: number = 10) {
    const transactions = await this.server
      .transactions()
      .forAccount(address)
      .limit(limit)
      .order('desc')
      .call();

    return transactions.records.map(tx => ({
      id: tx.id,
      hash: tx.hash,
      created_at: tx.created_at,
      source_account: tx.source_account,
      fee_charged: tx.fee_charged,
      successful: tx.successful,
    }));
  }

  async sendPayment(sourceSecret: string, destination: string, amount: string, memo?: string) {
    const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret);
    const sourceAccount = await this.server.loadAccount(sourceKeypair.publicKey());

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: this.network === 'mainnet' 
        ? StellarSdk.Networks.PUBLIC 
        : StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount,
        })
      )
      .setTimeout(30);

    if (memo) {
      transaction.addMemo(StellarSdk.Memo.text(memo));
    }

    const builtTx = transaction.build();
    builtTx.sign(sourceKeypair);

    const result = await this.server.submitTransaction(builtTx);
    return result;
  }
}
