import { useState } from 'react';
import { ShieldCheck, ShieldX, RefreshCw, CheckCircle2, XCircle, User } from 'lucide-react';
import { piSignIn, getPiUser } from '../lib/piPayment';

interface VerifyResult {
  verified: boolean;
  username?: string;
  uid?: string;
  kyc_verified?: boolean;
  error?: string;
}

export default function PiVerifyPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);

    try {
      // تسجيل دخول Pi أولاً
      const user = await piSignIn();
      if (!user) {
        setResult({ verified: false, error: 'فشل تسجيل الدخول بـ Pi' });
        setLoading(false);
        return;
      }

      // إرسال للـ API للتحقق
      const res = await fetch('/api/pi-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: user.accessToken,
          uid: user.uid
        })
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ verified: false, error: 'حدث خطأ أثناء التحقق' });
    }

    setLoading(false);
  };

  return (
    <div className="p-4 pb-24 space-y-4 max-w-md mx-auto">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border border-green-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-8 h-8 text-green-400" />
          <div>
            <h1 className="text-xl font-bold text-white">PiVerify</h1>
            <p className="text-xs text-gray-400">التحقق من هوية Pioneer — مدعوم بـ Pi2Day 2026</p>
          </div>
        </div>
        <p className="text-xs text-gray-300 mt-3 leading-relaxed">
          تحقق من أنك Pioneer حقيقي موثّق عبر نظام KYC الخاص بـ Pi Network. يُستخدم للوصول لميزات المنصة المتقدمة.
        </p>
      </div>

      {/* ميزات PiVerify */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '🔐', title: 'KYC موثّق', desc: 'تحقق حقيقي من Pi' },
          { icon: '👤', title: 'هوية فريدة', desc: 'لا حسابات مزيفة' },
          { icon: '🌍', title: '200+ دولة', desc: '18M+ مستخدم' },
          { icon: '⚡', title: 'فوري', desc: 'تحقق في ثوانٍ' },
        ].map((f, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
            <p className="text-2xl mb-1">{f.icon}</p>
            <p className="text-white text-sm font-bold">{f.title}</p>
            <p className="text-gray-400 text-xs">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* زر التحقق */}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all text-lg">
        {loading
          ? <><RefreshCw className="w-5 h-5 animate-spin" />جاري التحقق...</>
          : <><ShieldCheck className="w-5 h-5" />تحقق بـ PiVerify</>}
      </button>

      {/* النتيجة */}
      {result && (
        <div className={`rounded-2xl p-5 border ${
          result.verified
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {result.verified
              ? <CheckCircle2 className="w-8 h-8 text-green-400" />
              : <XCircle className="w-8 h-8 text-red-400" />}
            <div>
              <p className={`font-bold text-lg ${result.verified ? 'text-green-400' : 'text-red-400'}`}>
                {result.verified ? '✅ تم التحقق بنجاح!' : '❌ فشل التحقق'}
              </p>
              {result.error && <p className="text-xs text-red-400">{result.error}</p>}
            </div>
          </div>

          {result.verified && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-black/30 rounded-xl p-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">اسم المستخدم</p>
                  <p className="text-white font-bold">{result.username}</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-black/30 rounded-xl p-3">
                <p className="text-sm text-gray-400">KYC موثّق</p>
                {result.kyc_verified
                  ? <span className="text-green-400 text-sm font-bold">✅ نعم</span>
                  : <span className="text-yellow-400 text-sm font-bold">⏳ قيد المراجعة</span>}
              </div>
              <div className="bg-black/30 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Pioneer ID</p>
                <p className="text-white font-mono text-xs break-all">{result.uid}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
