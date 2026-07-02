interface PiUser {
  uid: string;
  username: string;
}

interface PiAuthResult {
  user: PiUser;
  accessToken: string;
}

interface PiPaymentData {
  amount: number;
  memo: string;
  metadata: Record<string, unknown>;
}

interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: unknown) => void;
}

interface PiIncompletePayment {
  identifier: string;
  transaction?: { txid: string } | null;
}

interface PiSDK {
  authenticate(
    scopes: string[],
    onIncompletePaymentFound: (payment: PiIncompletePayment) => void
  ): Promise<PiAuthResult>;
  createPayment(data: PiPaymentData, callbacks: PiPaymentCallbacks): void;
}

declare global {
  interface Window {
    Pi?: PiSDK;
  }
}

export {};
