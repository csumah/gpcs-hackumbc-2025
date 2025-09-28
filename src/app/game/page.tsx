'use client';

import { useState, useEffect } from 'react';
import { initializeGame, processQuarter, PlayerState, PlayerAction, gameData } from '@/lib/gamelogic';
import Card from '@/components/card';
import Controls from '@/components/controls';
// A simple charting library is a great stretch goal, but for the MVP we'll just show the final value.

export default function GamePage() {
  const [gameState, setGameState] = useState<PlayerState>(initializeGame());
  const [lastEventResult, setLastEventResult] = useState<{ marketCondition: string, volatileReturn: number, longTermReturn: number } | null>(null);

  // This function handles all player actions
  const handlePlayerAction = (action: PlayerAction) => {
    if (gameState.isGameOver) return;

    // Find the event that's about to be processed
    const currentEvent = gameData.find(y => y.year === gameState.year)
      ?.events.find(e => e.quarter === gameState.quarter);

    // Process the quarter
    const newState = processQuarter(gameState, action);
    setGameState(newState);

    // Store the results of the event to show the player what happened
    if (currentEvent) {
      setLastEventResult({
        marketCondition: currentEvent.marketCondition,
        volatileReturn: currentEvent.returns.volatileETF,
        longTermReturn: currentEvent.returns.longTermETF,
      });
    }
  };
  
  // This effect will run when the game is over to log final data
  useEffect(() => {
    if (gameState.isGameOver) {
      console.log("Game Over! Final History:", gameState.portfolioHistory);
    }
  }, [gameState.isGameOver, gameState.portfolioHistory]);


  // Find the current market event to pass to the card
  const currentEvent = !gameState.isGameOver 
    ? gameData.find(y => y.year === gameState.year)?.events.find(e => e.quarter === gameState.quarter)
    : undefined;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-gray-900 text-white font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Hit or Holdings</h1>
          <p className="text-gray-400 mt-2">An Investor Education Challenge by T. Rowe Price</p>
        </header>

        {gameState.isGameOver ? (
          <div className="text-center bg-gray-800 p-8 rounded-lg shadow-2xl">
            <h2 className="text-3xl font-bold text-green-400">Game Over!</h2>
            <p className="text-xl mt-4">
              After 5 years, your final portfolio value is:
            </p>
            <p className="text-5xl font-bold my-4 text-white">${gameState.portfolioHistory.at(-1)?.value.toFixed(2)}</p>
            <p className="text-gray-400">You started with $10,000.</p>
             <button onClick={() => setGameState(initializeGame())} className="mt-8 px-6 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-colors">
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

