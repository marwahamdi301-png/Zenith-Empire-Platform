import { useState } from "react";
import { initPiNetwork, authenticateWithPi, createPiToZenithPayment, getExchangeRate } from "../lib/piPayment";

export default function PiExchange() {
  const [piAmount, setPiAmount] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const rate = getExchangeRate();

  const handleAuth = async () => {
    initPiNetwork();
    const auth = await authenticateWithPi();
    setUser(auth);
  };

  const handleBuy = async () => {
    if (!user) return;
    setLoading(true);
    await createPiToZenithPayment(
      piAmount,
      piAmount * rate.pi_to_zenith,
      user.walletAddress
    );
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">
        🔄 تبادل Pi ↔ ZENITH
      </h1>
      <div className="bg-gray-800 rounded-xl p-4 mb-4">
        <p className="text-gray-400 text-sm">سعر الصرف</p>
        <p className="text-white text-xl">
          1 π = {rate.pi_to_zenith.toLocaleString()} ZENITH
        </p>
      </div>
      {!user ? (
        <button
          onClick={handleAuth}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold"
        >
          🔐 تسجيل الدخول بـ Pi
        </button>
      ) : (
        <div>
          <p className="text-green-400 mb-4">✅ {user.username}</p>
          <input
            type="number"
            value={piAmount}
            onChange={(e) => setPiAmount(Number(e.target.value))}
            className="w-full bg-gray-700 text-white p-3 rounded-xl mb-3"
            placeholder="كمية Pi"
            min="0.1"
          />
          <p className="text-yellow-400 mb-4">
            ستحصل على: {(piAmount * rate.pi_to_zenith).toLocaleString()} ZENITH
          </p>
          <button
            onClick={handleBuy}
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold"
          >
            {loading ? "جاري المعالجة..." : "🚀 شراء ZENITH بـ Pi"}
          </button>
        </div>
      )}
    </div>
  );
}
