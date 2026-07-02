import { useState, useCallback } from 'react';

export interface PiAuthState {
  user: { uid: string; username: string } | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isPiBrowser: boolean;
}

export function usePiAuth() {
  const [state, setState] = useState<PiAuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isPiBrowser: typeof window !== 'undefined' && !!window.Pi,
  });

  const onIncompletePaymentFound = useCallback((payment: PiIncompletePayment) => {
    console.warn('Incomplete payment found:', payment);
    // نعيد استخدام /api/pi/complete الموجود بدل عمل endpoint جديد
    if (payment?.transaction?.txid) {
      fetch('/api/pi/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: payment.identifier, txid: payment.transaction.txid }),
      }).catch(console.error);
    }
  }, []);

  const authenticate = useCallback(async () => {
    if (!window.Pi) {
      setState(s => ({ ...s, error: 'يجب فتح التطبيق داخل Pi Browser', isPiBrowser: false }));
      return null;
    }

    setState(s => ({ ...s, isLoading: true, error: null }));

    try {
      const auth = await window.Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);

      const res = await fetch('/api/pi/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: auth.accessToken }),
      });

      if (!res.ok) throw new Error('فشل التحقق من الهوية');

      setState({
        user: auth.user,
        accessToken: auth.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        isPiBrowser: true,
      });

      return auth;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'خطأ غير معروف';
      setState(s => ({ ...s, isLoading: false, error: message, isAuthenticated: false }));
      return null;
    }
  }, [onIncompletePaymentFound]);

  return { ...state, authenticate };
}
