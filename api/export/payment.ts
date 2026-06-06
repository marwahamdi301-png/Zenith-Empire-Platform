import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as StellarSdk from "@stellar/stellar-sdk";

interface ExportPayment {
  exporter: string;      // عنوان Stellar المصدّر
  importer: string;      // عنوان Stellar المستورد
  product: string;       // "olive_oil" | "prickly_pear"
  quantity_kg: number;   // الكمية بالكيلوغرام
  price_per_kg: number;  // السعر بالدولار
  currency: "EUR" | "USD" | "AED";
}

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';
const ZENITH_RATE = 1000; // 1 USD = 1000 ZENITH

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const payment: ExportPayment = req.body;
  const totalUSD = payment.quantity_kg * payment.price_per_kg;
  const zenithAmount = totalUSD * ZENITH_RATE;

  // حساب مكافآت المصدّر
  const exporterReward = zenithAmount * 0.02; // 2% مكافأة

  const invoice = {
    id: `ZE-${Date.now()}`,
    product: payment.product,
    quantity: payment.quantity_kg,
    total_usd: totalUSD,
    total_zenith: zenithAmount,
    exporter_reward: exporterReward,
    payment_address: payment.exporter,
    stellar_memo: `EXPORT:${payment.product.toUpperCase()}`,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
  };

  res.status(200).json({ success: true, invoice });
}
