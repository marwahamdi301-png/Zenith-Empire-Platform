import React from 'react';
import BinancePartner from '../components/BinancePartner';

export default function PartnersPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0B0B', padding: '40px 16px' }}>
      <h1 style={{
        color: '#D4AF37',
        textAlign: 'center',
        fontFamily: 'Tajawal, Cairo, sans-serif',
        marginBottom: '24px'
      }}>
        شركاؤنا
      </h1>
      <BinancePartner />
    </div>
  );
}
