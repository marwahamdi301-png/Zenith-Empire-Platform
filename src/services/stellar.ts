import * as StellarSdk from '@stellar/stellar-sdk';
import { ENV } from '../config/env';

export const getStellarServer = (): StellarSdk.Horizon.Server => {
  return new StellarSdk.Horizon.Server(ENV.STELLAR.HORIZON_URL);
};

export const getNetworkPassphrase = (): string => {
  return ENV.STELLAR.NETWORK === 'mainnet' ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET;
};

export const formatStellarAmount = (amount: string | number): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
};
