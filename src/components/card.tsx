import { PlayerState, MarketEvent } from '../lib/gamelogic';

interface CardProps {
  gameState: PlayerState;
  marketEvent?: MarketEvent;
  lastEventResult: { marketCondition: string, volatileReturn: number, longTermReturn: number } | null;
}

// A small helper component to show returns with appropriate colors
const ReturnIndicator = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  const color = isPositive ? 'text-green-400' : 'text-red-400';
  const sign = isPositive ? '+' : '';
  return (
    <span className={color}>
      ({sign}{(value * 100).toFixed(1)}%)
    </span>
  );
};

export default function Card({ gameState, marketEvent, lastEventResult }: CardProps) {
  const totalInvested = gameState.investments.volatileETF + gameState.investments.longTermETF;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-4 border border-gray-700">
      {/* Top row with main stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Year / Quarter</h3>
          <p className="text-2xl font-bold">{gameState.year} / Q{gameState.quarter}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Cash</h3>
          <p className="text-2xl font-bold text-green-400">${gameState.cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        {/* UPDATED: Show individual ETF values */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Volatile ETF</h3>
          <p className="text-2xl font-bold text-red-400">${gameState.investments.volatileETF.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Long-Term ETF</h3>
          <p className="text-2xl font-bold text-blue-400">${gameState.investments.longTermETF.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Bottom row for market insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-center bg-gray-700/50 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-300">House Insight for Q{gameState.quarter}</h4>
          <p className="text-lg italic text-yellow-300 mt-1">"{marketEvent?.houseInsight}"</p>
        </div>
        <div className="text-center bg-gray-700/50 p-4 rounded-lg">
           <h4 className="text-md font-semibold text-gray-300">Last Quarter's Result</h4>
           {lastEventResult ? (
            <p className="text-lg mt-1">
              {lastEventResult.marketCondition}: Volatile <ReturnIndicator value={lastEventResult.volatileReturn} />, Long-Term <ReturnIndicator value={lastEventResult.longTermReturn} />
            </p>
          ) : (
            <p className="text-lg mt-1 text-gray-400">Make your first move to see results.</p>
          )}
        </div>
      </div>
    </div>
  );
}
