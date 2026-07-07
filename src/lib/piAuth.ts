declare global {
  interface Window { Pi: any; }
}

export interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
  walletAddress?: string;
}

let piUser: PiUser | null = null;

export const getPiUser = () => piUser;

// تهيئة Pi SDK ومصادقة تلقائية
export const initAndAuthPi = async (): Promise<PiUser | null> => {
  if (typeof window === "undefined" || !window.Pi) {
    console.log("Pi SDK not available - not in Pi Browser");
    return null;
  }

  try {
    // await Pi.init كـ Promise
    await window.Pi.init({ version: "2.0", sandbox: false });
    console.log("✅ Pi SDK initialized");

    // مصادقة تلقائية
    const auth = await window.Pi.authenticate(
      ["username", "payments", "wallet_address"],
      onIncompletePayment
    );

    const accessToken = auth.accessToken;

    // تحقق من Token عبر الخادم
    const validated = await validateWithBackend(accessToken);

    if (validated) {
      piUser = {
        uid: auth.user.uid,
        username: auth.user.username,
        accessToken,
        walletAddress: auth.user.wallet_address
      };
      console.log("✅ Pi Auth success:", piUser.username);
      return piUser;
    }
    return null;

  } catch (error) {
    console.error("Pi Auth error:", error);
    return null;
  }
};

// التحقق من Token عبر الخادم
const validateWithBackend = async (accessToken: string): Promise<boolean> => {
  try {
    const res = await fetch("/api/pi-handler?action=validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken })
    });
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
};

const onIncompletePayment = async (payment: any) => {
  await fetch("/api/pi-handler?action=complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentId: payment.identifier,
      txid: payment.transaction?.txid
    })
  });
};
