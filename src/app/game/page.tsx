'use client';

import { useState, useEffect } from 'react';
import { initializeGame, processQuarter, PlayerState, PlayerAction, gameData } from '@/lib/gamelogic';
import Card from '@/components/card';
import Controls from '@/components/controls';
import YearlyRecap from '@/components/YearlyRecap';
import { AreaChart, Area, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GamePage() {
  const [gameState, setGameState] = useState<PlayerState>(initializeGame());
  const [lastEventResult, setLastEventResult] = useState<{ marketCondition: string, volatileReturn: number, longTermReturn: number } | null>(null);
  const [showRecap, setShowRecap] = useState(false);

  const handlePlayerAction = (action: PlayerAction) => {
    if (gameState.isGameOver || showRecap) return;

    const currentEvent = gameData.find(y => y.year === gameState.year)?.events.find(e => e.quarter === gameState.quarter);
    const isYearEnd = gameState.quarter === 4;

    const newState = processQuarter(gameState, action);
    
    if (newState !== gameState) {
      setGameState(newState);
    }

    if (currentEvent) {
      setLastEventResult({
        marketCondition: currentEvent.marketCondition,
        volatileReturn: currentEvent.returns.volatileETF,
        longTermReturn: currentEvent.returns.longTermETF,
      });
    }

    if (isYearEnd && !newState.isGameOver) {
      setShowRecap(true);
    }
  };
  
  const currentEvent = !gameState.isGameOver 
    ? gameData.find(y => y.year === gameState.year)?.events.find(e => e.quarter === gameState.quarter)
    : undefined;

  // Prepare combined data for the final chart
  const finalChartData = gameState.portfolioHistory.map((playerPoint, index) => {
    // THE FIX: Check if the savings history entry exists before accessing it
    const savingsValue = gameState.savingsHistory[index] ? gameState.savingsHistory[index].value : null;

    return {
      ...playerPoint,
      'Savings Only': savingsValue,
    };
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gray-900 text-white font-sans">
      {showRecap && <YearlyRecap history={gameState.portfolioHistory} onClose={() => setShowRecap(false)} />}
      
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Hit or Holdings</h1>
          <p className="text-gray-400 mt-2">An Investor Education Challenge by T. Rowe Price</p>
        </header>

        {gameState.isGameOver ? (
          <div className="text-center bg-gray-800 p-6 sm:p-8 rounded-lg shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold text-green-400">Game Over!</h2>
            <p className="text-xl mt-4">Here's your final performance vs. just saving your money:</p>
            
            <div style={{ width: '100%', height: 300 }} className="mt-6">
                 <ResponsiveContainer>
                    <ComposedChart data={finalChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="year" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" tickFormatter={(value) => `$${(Number(value) / 1000)}k`} />
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                           formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="cash" stackId="1" name="Cash" stroke="#2E7D32" fill="#4CAF50" />
                        <Area type="monotone" dataKey="longTermETF" stackId="1" name="Long-Term ETF" stroke="#1976D2" fill="#2196F3" />
                        <Area type="monotone" dataKey="volatileETF" stackId="1" name="Volatile ETF" stroke="#D32F2F" fill="#F44336" />
                        <Line type="monotone" dataKey="Savings Only" stroke="#A0AEC0" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls={true} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

             <button onClick={() => { setGameState(initializeGame()); setLastEventResult(null); }} className="mt-8 px-6 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                Play Again
            </button>
          </div>
        ) : (
          <>
            <Card gameState={gameState} marketEvent={currentEvent} lastEventResult={lastEventResult} />
            <Controls onAction={handlePlayerAction} playerState={gameState} />
          </>
        )}
      </div>
    </main>
  );
}

