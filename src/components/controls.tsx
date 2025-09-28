import { PlayerAction, PlayerState } from '@/lib/gamelogic';
import { useState } from 'react';

interface ControlsProps {
  onAction: (action: PlayerAction) => void;
  playerState: PlayerState;
}

export default function Controls({ onAction, playerState }: ControlsProps) {
  const [amount, setAmount] = useState(1000);

  const handleStand = () => {
    onAction({ type: 'STAND' });
  };

  const handleHit = (etf: 'volatileETF' | 'longTermETF') => {
    // Clamp the amount to ensure it's not more than available cash
    const validAmount = Math.max(0, Math.min(amount, playerState.cash));
    if (validAmount > 0) {
      onAction({ type: 'HIT', etf, amount: validAmount });
    } else {
      // Optional: provide feedback that they have no cash to invest
      console.log("Not enough cash to invest.");
    }
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <label htmlFor="amount" className="font-semibold text-lg">Investment Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="bg-gray-700 p-2 rounded-md w-40 text-center text-lg font-bold border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          step="100"
          min="0"
          max={playerState.cash}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button 
          onClick={() => handleHit('volatileETF')} 
          className="p-4 bg-red-600 rounded-lg font-bold text-lg hover:bg-red-700 transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
          disabled={playerState.cash <= 0}
        >
          HIT (Volatile)
        </button>
        <button 
          onClick={handleStand} 
          className="p-4 bg-gray-500 rounded-lg font-bold text-lg hover:bg-gray-600 transition-transform transform hover:scale-105"
        >
          STAND
        </button>
        <button 
          onClick={() => handleHit('longTermETF')} 
          className="p-4 bg-blue-600 rounded-lg font-bold text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
          disabled={playerState.cash <= 0}
        >
          HIT (Long-Term)
        </button>
      </div>
       <p className="text-center text-xs text-gray-500 mt-4">
        Clicking 'HIT' invests the specified amount. 'STAND' holds your cash and investments for the quarter.
      </p>
    </div>
  );
}
