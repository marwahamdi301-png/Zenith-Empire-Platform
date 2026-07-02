export default function handler(req, res) {
  const check = (v) => !!(process.env[v] && process.env[v].length > 0);
  res.status(200).json({
    TELEGRAM_BOT_TOKEN: check('TELEGRAM_BOT_TOKEN'),
    UPSTASH_REDIS_REST_URL: check('UPSTASH_REDIS_REST_URL'),
    UPSTASH_REDIS_REST_TOKEN: check('UPSTASH_REDIS_REST_TOKEN'),
    STELLAR_SECRET_KEY: check('STELLAR_SECRET_KEY'),
    JWT_SECRET: check('JWT_SECRET'),
    PI_API_KEY: check('PI_API_KEY'),
  });
}
