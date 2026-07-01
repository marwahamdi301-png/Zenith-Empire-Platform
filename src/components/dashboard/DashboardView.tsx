import PriceChart from "../PriceChart";
import { MarketOverview } from './MarketOverview';
import { PortfolioManager } from './PortfolioManager';

export function DashboardView() {
  return (
    <div className="space-y-6 animate-slide-in">

      {/* Real Portfolio - connect wallet to see actual holdings */}
      <PortfolioManager />

      {/* Live ZENITH Price */}
      <PriceChart />

      {/* Market Overview */}
      <MarketOverview />

    </div>
  );
}
