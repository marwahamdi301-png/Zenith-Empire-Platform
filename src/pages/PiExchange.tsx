import { useState, useEffect } from "react";
import { piSignIn, piSignOut, getPiUser, createPiToZenithPayment, getExchangeRate } from "../lib/piPayment";
import { LogIn, LogOut, Zap, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function PiExchange() {
  const [piAmount, setPiAmount] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const rate = getExchangeRate();

  useEffect(() => {
    const saved = getPiUser();
    if (saved) setUser(saved);
  }, []);

  const handleSignIn = async () => {
    setAuthLoading(true);
    setStatus(null);
    const u = await piSignIn();
    if (u) {
      setUser(u);
      setStatus({ type: "success", msg: `مرحباً ${u.username}! تم تسجيل الدخول بنجاح ✅` });
    } else {
      setStatus({ type: "error", msg: "فشل تسجيل الدخول. تأكد أنك داخل Pi Browser." });
    }
    setAuthLoading(false);
  };

  const handleSignOut = () => {
    piSignOut();
    setUser(null);
    setStatus(null);
  };

  const handleBuy = async () => {
    if (!user) return;
    setLoading(true);
    setStatus(null);
    try {
      await createPiToZenithPayment(
        piAmount,
        piAmount * rate.pi_to_zenith,
        user.walletAddress
      );
      setStatus({ type: "success", msg: `تم شراء ${(piAmount * rate.pi_to_zenith).toLocaleString()} ZENITH بنجاح! 🎉` });
    } catch {
      setStatus({ type: "error", msg: "فشلت العملية. حاول مجدداً." });
    }
    setLoading(false);
  };

  const zenithAmount = piAmount * rate.pi_to_zenith;

  return (
    <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-yellow-900/50 border border-purple-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">π</span>
          <div>
            <h1 className="text-xl font-bold text-white">تبادل Pi ↔ ZENITH</h1>
            <p className="text-xs text-gray-400">مدعوم بـ Pi Sign-in 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 bg-black/30 rounded-xl p-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <p className="text-sm text-white">1 π = <span className="text-yellow-400 font-bold">{rate.pi_to_zenith.toLocaleString()} ZENITH</span></p>
        </div>
      </div>

      {/* Status */}
      {status && (
        <div className={`flex items-start gap-3 rounded-xl p-4 ${
          status.type === "success"
            ? "bg-green-500/10 border border-green-500/30"
            : "bg-red-500/10 border border-red-500/30"
        }`}>
          {status.type === "success"
            ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            : <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          <p className={`text-sm ${status.type === "success" ? "text-green-400" : "text-red-400"}`}>
            {status.msg}
          </p>
        </div>
      )}

      {/* Auth */}
      {!user ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <div className="text-center">
            <span className="text-5xl">π</span>
            <p className="text-white font-bold mt-2">Pi Sign-in</p>
            <p className="text-xs text-gray-400 mt-1">سجّل دخولك بحساب Pi للبدء</p>
          </div>
          <button
            onClick={handleSignIn}
            disabled={authLoading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-colors">
            {authLoading
              ? <><RefreshCw className="w-4 h-4 animate-spin" />جاري التسجيل...</>
              : <><LogIn className="w-4 h-4" />تسجيل الدخول بـ Pi</>}
          </button>
          <p className="text-xs text-center text-gray-500">يتطلب Pi Browser أو Pi App</p>
        </div>
      ) : (
        <>
          {/* User Card */}
          <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-white font-bold">{user.username}</p>
                <p className="text-xs text-green-400">✅ Pioneer موثّق</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
              <LogOut className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Exchange */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <p className="text-sm font-bold text-white">كمية Pi</p>
            <div className="flex gap-2">
              {[1, 5, 10, 50].map(v => (
                <button key={v}
                  onClick={() => setPiAmount(v)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
                    piAmount === v
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}>
                  {v}π
                </button>
              ))}
            </div>
            <input
              type="number"
              value={piAmount}
              onChange={e => setPiAmount(Math.max(0.1, Number(e.target.value)))}
              className="w-full bg-gray-800 text-white p-3 rounded-xl text-center text-lg font-bold"
              min="0.1"
              step="0.1"
            />
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">ستحصل على</p>
              <p className="text-2xl font-bold text-yellow-400">{zenithAmount.toLocaleString()} ZENITH</p>
            </div>
            <button
              onClick={handleBuy}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all">
              {loading
                ? <><RefreshCw className="w-4 h-4 animate-spin" />جاري المعالجة...</>
                : <><Zap className="w-4 h-4" />شراء ZENITH بـ Pi</>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
