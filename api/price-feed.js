const FRED_SERIES = {
  OLIVE_OIL: 'POLVOILUSDM',
};

export default async function handler(req, res) {
  const commodity = (req.query.commodity || 'OLIVE_OIL').toUpperCase();
  const seriesId = FRED_SERIES[commodity];

  if (!seriesId) {
    return res.status(400).json({
      error: 'UNSUPPORTED_COMMODITY',
      message: `السلعة ${commodity} غير مدعومة حالياً`,
      supported: Object.keys(FRED_SERIES),
    });
  }

  try {
    const apiKey = process.env.FRED_API_KEY;
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=1`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`);
    }

    const data = await response.json();
    const latest = data.observations?.[0];

    if (!latest) {
      throw new Error('No data returned from FRED');
    }

    return res.status(200).json({
      source: 'FRED (IMF Global Price Index)',
      commodity,
      price_usd_per_metric_ton: parseFloat(latest.value),
      period: latest.date,
      note: 'Monthly global benchmark price, not real-time spot price',
    });
  } catch (error) {
    console.error('Price feed error:', error.message);
    return res.status(500).json({
      error: 'PRICE_FEED_UNAVAILABLE',
      message: 'تعذر جلب السعر الحالي، حاول لاحقاً',
    });
  }
}
