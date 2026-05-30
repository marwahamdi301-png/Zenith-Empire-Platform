import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingChartProps {
  symbol?: string;
}

export function TradingChart({ symbol = 'BINANCE:XLMUSDT' }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#1a1a2e',
          enable_publishing: false,
          hide_side_toolbar: false,
          container_id: 'tradingview_chart',
        });
      }
    };
    document.head.appendChild(script);
  }, [symbol]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
      <div className="h-[500px]" id="tradingview_chart" ref={containerRef} />
    </div>
  );
}
