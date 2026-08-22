const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_API = `https://api.telegram.org/bot${TOKEN}`;
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

async function redisCmd(...args) {
  const res = await fetch(UPSTASH_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args)
  });
  const data = await res.json();
  return data.result;
}

const DEFAULT_USER = () => ({ points: 0, referrals: 0, referred: false, awaitingSellerInfo: false });

async function getUser(id) {
  const raw = await redisCmd('GET', `hub:user:${id}`);
  if (raw) return JSON.parse(raw);
  const fresh = DEFAULT_USER();
  await saveUser(id, fresh);
  return fresh;
}

async function saveUser(id, user) {
  await redisCmd('SET', `hub:user:${id}`, JSON.stringify(user));
  await redisCmd('ZADD', 'hub:leaderboard', user.points, String(id));
}

async function getLeaderboard(limit = 10) {
  const raw = await redisCmd('ZREVRANGE', 'hub:leaderboard', 0, limit - 1, 'WITHSCORES');
  const result = [];
  for (let i = 0; i < raw.length; i += 2) {
    result.push({ uid: raw[i], points: parseInt(raw[i + 1]) });
  }
  return result;
}

async function saveSellerLead(id, text) {
  await redisCmd('SET', `hub:seller:${id}:${Date.now()}`, text);
}

async function send(chatId, text, extra = {}) {
  await fetch(`${TG_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown', ...extra })
  });
}

async function answerCallback(id, text) {
  await fetch(`${TG_API}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: id, text })
  });
}

const CATEGORIES = [
  { id: 'oils', title: '🫒 زيوت (زيتون، أركان، حبة سوداء)' },
  { id: 'dates', title: '🌴 تمور' },
  { id: 'spices', title: '🌶️ بهارات وتوابل' },
  { id: 'textiles', title: '🧵 نسيج وسجاد' },
  { id: 'ceramics', title: '🏺 فخار وزليج' },
  { id: 'honey', title: '🍯 عسل طبيعي' },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ status: 'Zenith Trade Hub Bot Active ✅' });

  const update = req.body;

  try {
    if (update.message) {
      const msg = update.message;
      const id = msg.chat.id;
      const text = msg.text || '';
      const user = await getUser(id);

      // استقبال معلومات بائع جديد (بعد الضغط على "سجل كمورّد")
      if (user.awaitingSellerInfo && !text.startsWith('/')) {
        await saveSellerLead(id, text);
        user.awaitingSellerInfo = false;
        user.points += 50;
        await saveUser(id, user);
        await send(id, `✅ *تم استلام طلبك!*\n\nسنراجع بياناتك ونتواصل معك خلال 48 ساعة.\n\n🎁 +50 نقطة ولاء لتسجيلك.`);
        if (ADMIN_CHAT_ID) {
          await send(ADMIN_CHAT_ID, `🆕 *طلب مورّد جديد*\n\nمن: ${id}\n\n${text}`);
        }
        return res.status(200).json({ ok: true });
      }

      if (text.startsWith('/start')) {
        const parts = text.split(' ');
        const ref = parts[1];
        if (ref && ref !== String(id) && !user.referred) {
          const referrer = await getUser(ref);
          referrer.points += 30;
          referrer.referrals += 1;
          await saveUser(ref, referrer);
          user.referred = true;
          await saveUser(id, user);
          await send(ref, `🎉 صديق جديد انضم عبر رابطك! +30 نقطة ولاء`);
        }

        await send(id, `🌍 *مرحباً في Zenith Trade Hub!*\n\nمنصة تربط منتجين من تونس، المغرب، والجزائر بمشترين في أوروبا والخليج مباشرة.\n\n⭐ نقاطك: *${user.points}*\n\nكيف نقدر نساعدك؟`, {
          reply_markup: {
            keyboard: [
              ['🛒 تصفح المنتجات', '🏪 سجل كمورّد'],
              ['📞 تواصل مباشر', '⭐ نقاطي'],
              ['👥 دعوة صديق', '🌐 الموقع']
            ],
            resize_keyboard: true
          }
        });
      }
      else if (text === '🛒 تصفح المنتجات') {
        const buttons = CATEGORIES.map(c => [{ text: c.title, callback_data: `cat_${c.id}` }]);
        await send(id, '🛒 *اختر فئة المنتجات:*', { reply_markup: { inline_keyboard: buttons } });
      }
      else if (text === '🏪 سجل كمورّد') {
        user.awaitingSellerInfo = true;
        await saveUser(id, user);
        await send(id, `🏪 *سجل كمورّد جديد*\n\nأرسل رسالة واحدة تحتوي:\n1. اسم النشاط التجاري\n2. الدولة والمدينة\n3. المنتجات اللي تصدّرها\n4. رقم واتساب للتواصل\n\n📩 اكتبها كلها في رسالة واحدة وأرسلها الآن:`);
      }
      else if (text === '📞 تواصل مباشر') {
        await send(id, `📞 *تواصل معنا مباشرة*\n\nفريقنا يرد على كل استفسار شخصياً:`, {
          reply_markup: { inline_keyboard: [
            [{ text: '💬 انضم لقناة تيليجرام', url: 'https://t.me/BayaEmpireOfficial' }]
          ] }
        });
      }
      else if (text === '⭐ نقاطي') {
        const tier = user.points >= 200 ? '🥇 شريك ذهبي' : user.points >= 100 ? '🥈 شريك فضي' : '🥉 عضو جديد';
        await send(id, `⭐ *رصيد نقاطك*\n\nالنقاط: *${user.points}*\nالإحالات: *${user.referrals}*\n\n🏆 مستواك: ${tier}\n\n(النقاط تُستخدم لعرض منتجاتك بشكل مميز في السوق لاحقاً)`);
      }
      else if (text === '👥 دعوة صديق') {
        const link = `https://t.me/Baya_tradingbot?start=${id}`;
        await send(id, `👥 *ادعُ مورّد أو مشترٍ جديد*\n\nاكسب *30 نقطة* لكل صديق ينضم!\n\n🔗 \`${link}\``);
      }
      else if (text === '🌐 الموقع') {
        await send(id, `🌐 *Zenith Trade Hub*\n\nzenithempire.online\n\nتصفح كل المنتجات والموردين على الموقع مباشرة.`, {
          reply_markup: { inline_keyboard: [[{ text: '🚀 افتح الموقع', url: 'https://zenithempire.online' }]] }
        });
      }
    }

    else if (update.callback_query) {
      const query = update.callback_query;
      const id = query.message.chat.id;
      const data = query.data;

      if (data.startsWith('cat_')) {
        const catId = data.split('_')[1];
        const cat = CATEGORIES.find(c => c.id === catId);
        await send(id, `${cat.title}\n\nلعرض المنتجات المتوفرة حالياً والتواصل مع الموردين مباشرة، تفضل بزيارة السوق على الموقع:`, {
          reply_markup: { inline_keyboard: [[{ text: '🛒 عرض المنتجات', url: `https://zenithempire.online/#market-${catId}` }]] }
        });
        await answerCallback(query.id);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ ok: true, error: err.message });
  }
}
