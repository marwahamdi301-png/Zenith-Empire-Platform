import { ExternalLink, Download, CheckCircle2, Wallet } from 'lucide-react';

const ZENITH_ISSUER = 'GA3T3OZ5V2JAZR5RCH3NII7JBNUMDPBSSXF6N6HKZGLTM5JSZCX7OTFQ';

export function TrustlineGuide() {
  const steps = [
    { n: '1', title: 'حمّل LOBSTR', desc: 'محفظة Stellar مجانية على الهاتف', link: 'https://lobstr.co', btn: 'تحميل LOBSTR' },
    { n: '2', title: 'أنشئ محفظة', desc: 'سجّل وأنشئ محفظة Stellar جديدة في LOBSTR' },
    { n: '3', title: 'أضف ZENITH', desc: 'في LOBSTR: Assets ← Add Asset ← ابحث عن ZENITH' },
    { n: '4', title: 'ابدأ التعدين', desc: 'انسخ عنوان محفظتك من LOBSTR وأدخله في Mining' },
  ];

  return (
    <div className="space-y-4 p-4 pb-24">
      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🪙</span>
          <div>
            <h2 className="text-lg font-bold text-white">كيف تستقبل ZENITH؟</h2>
            <p className="text-xs text-yellow-400/70">4 خطوات بسيطة</p>
          </div>
        </div>
        <p className="text-xs text-gray-300">
          ZENITH يعمل على Stellar Network. تحتاج محفظة Stellar لاستقباله.
        </p>
      </div>

      {steps.map((s, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex gap-4">
          <div className="w-9 h-9 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center shrink-0">
            <span className="text-yellow-400 font-bold text-sm">{s.n}</span>
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm font-bold text-white">{s.title}</p>
            <p className="text-xs text-gray-400">{s.desc}</p>
            {s.link && (
              <a href={s.link} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-yellow-400 text-black text-xs font-bold px-4 py-2 rounded-xl hover:bg-yellow-300 transition-colors">
                <Download className="w-3.5 h-3.5" />
                {s.btn}
              </a>
            )}
          </div>
          <CheckCircle2 className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
        </div>
      ))}

      {/* ZENITH Asset Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Wallet className="w-4 h-4 text-yellow-400" />
          معلومات ZENITH Token
        </h3>
        <div className="space-y-2">
          <div className="bg-gray-800 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Asset Code</p>
            <p className="font-mono text-sm text-yellow-400">ZENITH</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Issuer Address</p>
            <p className="font-mono text-xs text-gray-300 break-all">{ZENITH_ISSUER}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Network</p>
            <p className="text-sm text-white">Stellar Mainnet</p>
          </div>
        </div>
        <a href={`https://stellar.expert/explorer/public/asset/ZENITH-${ZENITH_ISSUER}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm py-2.5 rounded-xl transition-colors">
          <ExternalLink className="w-4 h-4" />
          عرض ZENITH على Stellar Explorer
        </a>
      </div>
    </div>
  );
}
