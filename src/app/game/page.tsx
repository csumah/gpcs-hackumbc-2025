"use client";

import { useState, useEffect } from 'react';
import { initializeGame, processQuarter, PlayerState, PlayerAction, gameData } from '@/lib/gamelogic';

export default function GamePage() {
  const [gameState, setGameState] = useState<PlayerState>(initializeGame());
  const [lastEventResult, setLastEventResult] = useState<{ marketCondition: string, volatileReturn: number, longTermReturn: number } | null>(null);
  const [volatileAmount, setVolatileAmount] = useState(1000);
  const [longAmount, setLongAmount] = useState(1000);

  const handlePlayerAction = (action: PlayerAction) => {
    if (gameState.isGameOver) return;

    const currentEvent = gameData.find(y => y.year === gameState.year)?.events.find(e => e.quarter === gameState.quarter);
    const newState = processQuarter(gameState, action);
    if (newState !== gameState) setGameState(newState);

    if (currentEvent) {
      setLastEventResult({
        marketCondition: currentEvent.marketCondition,
        volatileReturn: currentEvent.returns.volatileETF,
        longTermReturn: currentEvent.returns.longTermETF,
      });
    }
  };
  
  const currentEvent = !gameState.isGameOver
    ? gameData.find(y => y.year === gameState.year)?.events.find(e => e.quarter === gameState.quarter)
    : undefined;

  const executeHit = (etf: 'volatileETF' | 'longTermETF', amount: number) => {
    const clamped = Math.max(0, Math.min(amount, gameState.cash));
    if (clamped > 0) handlePlayerAction({ type: 'HIT', etf, amount: clamped });
  };

  const totalValue = gameState.cash + gameState.investments.volatileETF + gameState.investments.longTermETF;
  const totalProfit = totalValue - 10000;

  if (gameState.isGameOver) {
    return (
      <main className="min-h-screen bg-board flex items-center justify-center p-6 text-black">
        <div className="pixel-panel" style={{ maxWidth: 720 }}>
          <h1 className="text-4xl font-bold mb-4">Game Over!</h1>
          <p className="mb-3 text-lg">Final Portfolio Value:</p>
          <p className="text-5xl font-bold mb-4">${(totalValue).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
          <p className="mb-6">Profit: ${(totalProfit).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
          <button onClick={() => { setGameState(initializeGame()); setLastEventResult(null); setVolatileAmount(1000); setLongAmount(1000); }} className="invest-btn">Play Again</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-board p-6 flex flex-col items-center text-black">
      <div className="w-full max-w-[1500px]">
        <div className="pixel-panel mb-6 inline-block text-lg font-bold">Year {gameState.year} / Q{gameState.quarter}</div>
        <div className="layout-grid mb-6">
          <div>
            <div className="graph-placeholder">Graph</div>
          </div>
          <div className="flex flex-col items-start gap-10">
            <div className="speech-bubble w-full min-h-[260px] flex items-center justify-center text-xl font-semibold text-center">
              <div>
                {currentEvent ? (
                  <>
                    <p className="mb-2">Insight:</p>
                    <p className="font-normal max-w-[520px] mx-auto">{currentEvent.houseInsight}</p>
                  </>
                ) : <p>...</p>}
              </div>
            </div>
            <div className="pixel-panel" style={{ width: 220, height: 170 }}>Sprite</div>
          </div>
        </div>
        <div className="pixel-shelf" />
        <div className="value-grid mb-8">
          <div className="value-card">Total Cash Savings: ${gameState.cash.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
          <div className="value-card">Portfolio Total: ${totalValue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
          <div className="value-card">Total Profit: ${totalProfit.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
        </div>
        <div className="flex flex-wrap items-center gap-10 mb-10">
          <div className="flex items-center gap-4">
            <span className="pm-btn" onClick={() => setVolatileAmount(v => Math.max(0, v - 500))}>–</span>
            <div className="amount-box">{volatileAmount}</div>
            <span className="pm-btn" onClick={() => setVolatileAmount(v => Math.min(gameState.cash, v + 500))}>+</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="pm-btn" onClick={() => setLongAmount(v => Math.max(0, v - 500))}>–</span>
            <div className="amount-box">{longAmount}</div>
            <span className="pm-btn" onClick={() => setLongAmount(v => Math.min(gameState.cash, v + 500))}>+</span>
          </div>
        </div>
        <div className="action-grid mb-16">
          <div className="action-card" style={{ background: '#ff4545' }}>
            <div className="mb-4">
              <h3 className="text-2xl mb-2">Volatile ETF</h3>
              <p className="text-sm mb-1">Current Invested:</p>
              <p className="font-bold mb-2">${gameState.investments.volatileETF.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div>
              <div className="invest-btn" onClick={() => executeHit('volatileETF', volatileAmount)}>Hit</div>
            </div>
          </div>
          <div className="action-card stand" style={{ background: '#b7f879' }}>
            <div className="mb-4">
              <h3 className="text-2xl mb-2">Stand</h3>
              <p className="text-sm mb-1">Cash on Hand:</p>
              <p className="font-bold mb-2">${gameState.cash.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div>
              <div className="invest-btn" onClick={() => handlePlayerAction({ type: 'STAND' })}>Advance Quarter</div>
            </div>
          </div>
          <div className="action-card" style={{ background: '#ff4545' }}>
            <div className="mb-4">
              <h3 className="text-2xl mb-2">Long-Term ETF</h3>
              <p className="text-sm mb-1">Current Invested:</p>
              <p className="font-bold mb-2">${gameState.investments.longTermETF.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div>
              <div className="invest-btn" onClick={() => executeHit('longTermETF', longAmount)}>Hit</div>
            </div>
          </div>
        </div>
        <div className="value-grid mb-24">
          <div className="value-card" style={{ gridColumn: 'span 2 / auto' }}>
            {lastEventResult ? (
              <>
                <p className="font-semibold mb-1">Last Quarter Result:</p>
                <p className="text-sm">{lastEventResult.marketCondition} | Volatile {(lastEventResult.volatileReturn * 100).toFixed(1)}% | Long {(lastEventResult.longTermReturn * 100).toFixed(1)}%</p>
              </>
            ) : <p className="text-sm">Invest to see results next quarter.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}