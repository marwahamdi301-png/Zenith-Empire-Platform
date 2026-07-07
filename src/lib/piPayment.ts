declare global {
  interface Window { Pi: any; }
}

export const initPiNetwork = () => {
  if (typeof window !== "undefined" && window.Pi) {
    window.Pi.init({ version: "2.0", sandbox: false });
  }
};

export const authenticateWithPi = async () => {
  initPiNetwork();
  const auth = await window.Pi.authenticate(
    ["payments", "username", "wallet_address"],
    onIncompletePayment
  );
  return {
    username: auth.user.username,
    uid: auth.user.uid,
    walletAddress: auth.user.wallet_address,
    accessToken: auth.accessToken
  };
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

export const createPiToZenithPayment = async (
  piAmount: number,
  zenithAmount: number,
  userWallet: string
) => {
  return await window.Pi.createPayment(
    {
      amount: piAmount,
      memo: `شراء ${zenithAmount} ZENITH`,
      metadata: {
        type: "PI_TO_ZENITH",
        zenith_amount: zenithAmount,
        stellar_address: userWallet
      }
    },
    {
      onReadyForServerApproval: async (paymentId: string) => {
        await fetch("/api/pi-handler?action=approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId })
        });
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        await fetch("/api/pi-handler?action=complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid })
        });
      },
      onCancel: (paymentId: string) => console.log("cancelled:", paymentId),
      onError: (error: any) => console.error("error:", error)
    }
  );
};

export const getExchangeRate = () => ({
  pi_to_zenith: 1000,
  zenith_to_pi: 0.001
});

// Pi Sign-in 2026 - تسجيل دخول عبر Pi خارج Pi Browser
export const piSignIn = async () => {
  initPiNetwork();
  try {
    const auth = await window.Pi.authenticate(
      ["username", "wallet_address"],
      async (payment: any) => {
        await fetch("/api/pi-handler?action=complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId: payment.identifier })
        });
      }
    );
    const user = {
      username: auth.user.username,
      uid: auth.user.uid,
      walletAddress: auth.user.wallet_address,
      accessToken: auth.accessToken,
      verified: true
    };
    localStorage.setItem("pi_user", JSON.stringify(user));
    return user;
  } catch (e) {
    console.error("Pi Sign-in failed:", e);
    return null;
  }
};

export const getPiUser = () => {
  const u = localStorage.getItem("pi_user");
  return u ? JSON.parse(u) : null;
};

export const piSignOut = () => {
  localStorage.removeItem("pi_user");
};
