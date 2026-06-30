const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8734851297:AAFiO68LkzPCv-cYO240IMdctsN6P9xgVFk';
const TG_API = `https://api.telegram.org/bot${TOKEN}`;

// قاعدة بيانات بسيطة في الذاكرة (تُستبدل لاحقاً بـ KV/DB دائم)
let users = global.__zenithUsers || {};
global.__zenithUsers = users;

function getUser(id) {
  if (!users[id]) users[id] = { zen: 0, level: 1, lessons: [], referrals: 0, referred: false };
  return users[id];
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

const LESSONS = [
  { id: 1, title: '🌟 ما هو Stellar Blockchain؟', reward: 100,
    content: `*الدرس 1: Stellar Blockchain*\n\n🔷 Stellar شبكة blockchain مفتوحة المصدر:\n• تحويلات سريعة (3 ثوانٍ)\n• رسوم منخفضة جداً\n• ربط العملات المختلفة\n\n🪙 XLM هو العملة الأصلية\n⚡ ZENITH مبني على Stellar\n\n✅ أجب لتكسب *100 ZEN*:`,
    quiz: { options: ['10 دقائق', '3 ثوانٍ', 'يوم كامل', 'ساعة'], correct: 1 }},
  { id: 2, title: '💎 ما هو ZENITH Token؟', reward: 150,
    content: `*الدرس 2: ZENITH Token*\n\n⚡ ZENITH token أفريقي على Stellar:\n• تسوية صادرات أفريقيا\n• ربط أفريقيا بأوروبا والخليج\n• يستهدف 54 دولة\n\n📊 Total Supply: 1,000,000,000\n\n✅ أجب لتكسب *150 ZEN*:`,
    quiz: { options: ['10 دول', '20 دولة', '54 دولة', '100 دولة'], correct: 2 }},
  { id: 3, title: '🔐 ما هو Pi Sign-in؟', reward: 200,
    content: `*الدرس 3: Pi Sign-in 2026*\n\n🆕 يتيح تسجيل الدخول لتطبيقات خارجية بحساب Pi\nبدون كلمة مرور، وصول لـ 18M+ Pioneer موثّق\n\n🔗 Zenith Empire يدعمه بالكامل!\n\n✅ أجب لتكسب *200 ZEN*:`,
    quiz: { options: ['1 مليون', '5 ملايين', '18 مليون', '100 مليون'], correct: 2 }},
  { id: 4, title: '💰 كيف يعمل Staking؟', reward: 250,
    content: `*الدرس 4: Staking*\n\n💎 30 يوم = 12% | 90 يوم = 25%\n180 يوم = 50% | 365 يوم = 100%\n\n✅ أجب لتكسب *250 ZEN*:`,
    quiz: { options: ['12%', '25%', '50%', '100%'], correct: 3 }},
  { id: 5, title: '🛡️ ما هو PiVerify؟', reward: 300,
    content: `*الدرس 5: PiVerify*\n\n🛡️ يفتح KYC الخاص بـ Pi للشركات الخارجية\nيتحقق أن المستخدم Pioneer حقيقي، يمنع الحسابات المزيفة\n\n✅ أجب لتكسب *300 ZEN*:`,
    quiz: { options: ['التداول', 'التحقق من الهوية', 'الدفع', 'التعدين'], correct: 1 }},
];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ status: 'Zenith Academy Bot Webhook Active ✅' });

  const update = req.body;

  try {
    // ===== رسالة نصية =====
    if (update.message) {
      const msg = update.message;
      const id = msg.chat.id;
      const text = msg.text || '';
      const user = getUser(id);

      if (text.startsWith('/start')) {
        const parts = text.split(' ');
        const ref = parts[1];
        if (ref && ref !== String(id) && !user.referred) {
          const referrer = getUser(ref);
          referrer.zen += 500;
          referrer.referrals += 1;
          user.referred = true;
          await send(ref, `🎉 صديق جديد انضم بإحالتك! +500 ZEN`);
        }

        await send(id, `⚡ *مرحباً في Zenith Academy!*\n\nتعلّم blockchain وكسب ZEN tokens 🎓\n\n💎 رصيدك: *${user.zen} ZEN*\n📊 مستواك: *${user.level}*\n📚 دروس مكتملة: *${user.lessons.length}*\n\nابدأ رحلتك! 🚀`, {
          reply_markup: {
            keyboard: [
              ['📚 الدروس', '💰 رصيدي'],
              ['👥 الإحالة', '🏆 المتصدرين'],
              ['🌐 المنصة', 'ℹ️ عن ZENITH']
            ],
            resize_keyboard: true
          }
        });
      }
      else if (text === '📚 الدروس') {
        const buttons = LESSONS.map(l => [{
          text: `${user.lessons.includes(l.id) ? '✅' : '📖'} ${l.title} (+${l.reward} ZEN)`,
          callback_data: `lesson_${l.id}`
        }]);
        await send(id, '📚 *اختر درساً:*', { reply_markup: { inline_keyboard: buttons } });
      }
      else if (text === '💰 رصيدي') {
        const tier = user.zen >= 1000 ? 'Pioneer 🥇' : user.zen >= 500 ? 'Explorer 🥈' : 'Beginner 🥉';
        await send(id, `💰 *رصيدك*\n\n⚡ ZEN: *${user.zen}*\n📊 المستوى: *${user.level}*\n📚 الدروس: *${user.lessons.length}/${LESSONS.length}*\n👥 الإحالات: *${user.referrals}*\n\n🏆 ${tier}`);
      }
      else if (text === '👥 الإحالة') {
        const link = `https://t.me/Baya_tradingbot?start=${id}`;
        await send(id, `👥 *برنامج الإحالة*\n\nشارك واكسب *500 ZEN* لكل صديق!\n\n🔗 \`${link}\`\n\nإحالاتك: *${user.referrals}*\nمكافآت: *${user.referrals * 500} ZEN*`);
      }
      else if (text === '🏆 المتصدرين') {
        const sorted = Object.entries(users).sort(([,a],[,b]) => b.zen - a.zen).slice(0, 10);
        let board = '🏆 *المتصدرون:*\n\n';
        const medals = ['🥇','🥈','🥉'];
        sorted.forEach(([uid, u], i) => { board += `${medals[i] || `${i+1}.`} User${String(uid).slice(-4)}: *${u.zen} ZEN*\n`; });
        await send(id, board || 'لا يوجد متصدرون بعد');
      }
      else if (text === '🌐 المنصة') {
        await send(id, `🌐 *Zenith Empire Platform*\n\nzenithempire.online\n\n⚡ تداول • Pi Sign-in • PiVerify • Staking • Marketplace`, {
          reply_markup: { inline_keyboard: [[{ text: '🚀 افتح المنصة', url: 'https://zenithempire.online' }]] }
        });
      }
      else if (text === 'ℹ️ عن ZENITH') {
        await send(id, `ℹ️ *ZENITH Token*\n\n🌍 أول token أفريقي على Stellar\n📊 Supply: 1,000,000,000\n⚡ Stellar Mainnet\n\nمدعوم بـ Pi2Day 2026: Pi Sign-in ✅ PiVerify ✅`);
      }
    }

    // ===== Callback (الدروس والإجابات) =====
    else if (update.callback_query) {
      const query = update.callback_query;
      const id = query.message.chat.id;
      const data = query.data;
      const user = getUser(id);

      if (data.startsWith('lesson_')) {
        const lessonId = parseInt(data.split('_')[1]);
        const lesson = LESSONS.find(l => l.id === lessonId);
        if (!lesson) return res.status(200).json({ ok: true });

        if (user.lessons.includes(lessonId)) {
          await answerCallback(query.id, '✅ أكملت هذا الدرس مسبقاً!');
        } else {
          await send(id, lesson.content, {
            reply_markup: { inline_keyboard: [lesson.quiz.options.map((opt, i) => ({ text: opt, callback_data: `answer_${lessonId}_${i}` }))] }
          });
          await answerCallback(query.id);
        }
      }
      else if (data.startsWith('answer_')) {
        const [, lessonIdStr, answerIdxStr] = data.split('_');
        const lessonId = parseInt(lessonIdStr);
        const answerIdx = parseInt(answerIdxStr);
        const lesson = LESSONS.find(l => l.id === lessonId);
        if (!lesson) return res.status(200).json({ ok: true });

        if (user.lessons.includes(lessonId)) {
          await answerCallback(query.id, '✅ أجبت مسبقاً!');
        } else if (answerIdx === lesson.quiz.correct) {
          user.zen += lesson.reward;
          user.lessons.push(lessonId);
          user.level = Math.floor(user.lessons.length / 2) + 1;
          const allDone = user.lessons.length === LESSONS.length ? '\n\n🏆 أكملت جميع الدروس! أنت Pioneer حقيقي!' : '';
          await send(id, `✅ *إجابة صحيحة!*\n\n🎉 +${lesson.reward} ZEN\n💰 رصيدك: *${user.zen} ZEN*\n📊 مستواك: *${user.level}*${allDone}`);
          await answerCallback(query.id, '✅ صحيح!');
        } else {
          await send(id, `❌ إجابة خاطئة! حاول مرة أخرى في الدرس.`);
          await answerCallback(query.id, '❌ خطأ');
        }
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ ok: true, error: err.message });
  }
}
