import React from 'react';

const BINANCE_REFERRAL_LINK = "https://www.binance.com/en/activity/referral?ref=CPA_00FVQRA7KT";
const BINANCE_REFERRAL_CODE = "CPA_00FVQRA7KT";

export default function BinancePartner() {
  return (
    <div style={{
      background: '#0B0B0B',
      border: '1px solid #D4AF37',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '480px',
      margin: '32px auto',
      textAlign: 'center',
      color: '#F5F5F5',
      fontFamily: 'Tajawal, Cairo, sans-serif'
    }}>
      <h3 style={{ color: '#D4AF37', marginBottom: '8px' }}>
        افتح حساب Binance
      </h3>
      <p style={{ fontSize: '14px', color: '#CCCCCC', marginBottom: '16px' }}>
        Zenith Empire ليست جزءًا من Binance ولا تدير أموالك على Binance.
        هذا رابط شراكة (Affiliate) رسمي يمنحك خصمًا على رسوم التداول عند التسجيل.
      </p>
      <a
        href={BINANCE_REFERRAL_LINK}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          background: '#D4AF37',
          color: '#0B0B0B',
          padding: '12px 28px',
          borderRadius: '8px',
          fontWeight: 'bold',
          textDecoration: 'none'
        }}
      >
        فتح حساب Binance
      </a>
      <p style={{ fontSize: '11px', color: '#777', marginTop: '12px' }}>
        كود الإحالة: {BINANCE_REFERRAL_CODE}
      </p>
    </div>
  );
}
