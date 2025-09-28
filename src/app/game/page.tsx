"use client";

import { useState, useEffect } from 'react';
import { initializeGame, processQuarter, PlayerState, PlayerAction, gameData } from '@/lib/gamelogic';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GamePage() {
  const [gameState, setGameState] = useState<PlayerState>(initializeGame());
  const [lastEventResult, setLastEventResult] = useState<{ marketCondition: string, volatileReturn: number, longTermReturn: number } | null>(null);
  // Unified investment amount used for both ETFs when hitting
  const [investAmount, setInvestAmount] = useState(1000);

  const handlePlayerAction = (action: PlayerAction) => {
    if (gameState.isGameOver) return;
    const beforeEvent = gameData.find(y => y.year === gameState.year)?.events.find(e => e.quarter === gameState.quarter);
    const newState = processQuarter(gameState, action);
    if (newState !== gameState) setGameState(newState);
    // Only reveal last quarter results after a STAND (i.e., after returns applied and quarter advanced)
    if (action.type === 'STAND' && beforeEvent) {
      setLastEventResult({
        marketCondition: beforeEvent.marketCondition,
        volatileReturn: beforeEvent.returns.volatileETF,
        longTermReturn: beforeEvent.returns.longTermETF,
      });
    }
  };
  
  const currentEvent = !gameState.isGameOver
    ? gameData.find(y => y.year === gameState.year)?.events.find(e => e.quarter === gameState.quarter)
    : undefined;

  const executeHit = (etf: 'volatileETF' | 'longTermETF', amount?: number) => {
    const useAmount = amount ?? investAmount;
    const clamped = Math.max(0, Math.min(useAmount, gameState.cash));
    if (clamped > 0) handlePlayerAction({ type: 'HIT', etf, amount: clamped });
  };

  const totalValue = gameState.cash + gameState.investments.volatileETF + gameState.investments.longTermETF;
  // Profit should exclude quarterly contributions ($2500 each quarter). Calculate quarters elapsed.
  const quartersElapsed = (gameState.year - 1) * 4 + (gameState.quarter - 1); // current quarter not yet stood if mid-quarter
  const contributed = 10000 + (quartersElapsed * 2500);
  const investmentProfit = totalValue - contributed;

  if (gameState.isGameOver) {
    // Build final chart data: map yearly portfolio history to include invested amount and savings-only baseline
    const finalChartData = gameState.portfolioHistory.map(ph => {
      const savings = gameState.savingsHistory.find(s => s.year === ph.year)?.value ?? null;
      return {
        label: ph.year === 0 ? 'Start' : `Y${ph.year}`,
        cash: ph.cash,
        invested: ph.volatileETF + ph.longTermETF,
        portfolio: ph.value,
        savingsOnly: savings,
      };
    });

    return (
      <main className="min-h-screen bg-board flex items-center justify-center p-10 text-black">
        <div className="pixel-panel" style={{ maxWidth: 1400, width: '100%', padding: '64px 72px' }}>
          <h1 className="text-7xl font-bold mb-10 text-center">Game Over!</h1>
          <div className="grid gap-12 md:grid-cols-3 mb-8">
            <div className="value-card" style={{ fontSize: '1.5rem' }}>
              <p className="font-semibold mb-2">Final Portfolio Value</p>
              <p className="text-5xl font-bold">${totalValue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div className="value-card" style={{ fontSize: '1.5rem' }}>
              <p className="font-semibold mb-2">Total Contributions</p>
              <p className="text-5xl font-bold">${contributed.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div className="value-card" style={{ fontSize: '1.5rem' }}>
              <p className="font-semibold mb-2">Net Profit</p>
              <p className={`text-5xl font-bold ${investmentProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>${investmentProfit.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
          </div>

          <div style={{ width: '100%', height: 420 }} className="mb-8">
            <ResponsiveContainer>
              <ComposedChart data={finalChartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(v) => `$${(Number(v) / 1000)}k`} />
                <Tooltip formatter={(value: any, name: any) => [`$${Number(value).toFixed(2)}`, name]} />
                <Legend />
                <Line type="monotone" dataKey="cash" name="Cash (available)" stroke="#4CAF50" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="invested" name="Invested" stroke="#FFA726" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="portfolio" name="Portfolio Value" stroke="#1976D2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="savingsOnly" name="Savings Only" stroke="#8884d8" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} strokeDasharray="6 4" connectNulls={true} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <div className="value-card" style={{ minWidth: 280 }}>
              <p className="font-semibold mb-1">Volatile ETF</p>
              <p className="text-3xl font-bold">${gameState.investments.volatileETF.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div className="value-card" style={{ minWidth: 280 }}>
              <p className="font-semibold mb-1">Long-Term ETF</p>
              <p className="text-3xl font-bold">${gameState.investments.longTermETF.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div className="value-card" style={{ minWidth: 280 }}>
              <p className="font-semibold mb-1">Cash</p>
              <p className="text-3xl font-bold">${gameState.cash.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
          </div>
          <div className="text-center">
            <button onClick={() => { setGameState(initializeGame()); setLastEventResult(null); setInvestAmount(1000); }} className="invest-btn" style={{ fontSize: '1.75rem', padding: '18px 42px' }}>Play Again</button>
          </div>
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
            <div className="speech-bubble w-full min-h-[260px] flex items-center justify-center text-center" style={{ padding:'40px 48px' }}>
              <div>
                {currentEvent ? (
                  <>
                    <p className="mb-5" style={{ fontSize:'28px', fontWeight:700 }}>Insight</p>
                    <p className="max-w-[680px] mx-auto" style={{ fontSize:'20px', lineHeight:1.4, fontWeight:500 }}>{currentEvent.houseInsight}</p>
                  </>
                ) : <p style={{ fontSize:'20px' }}>...</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="pixel-shelf" />
        <div className="mb-8 flex w-full gap-4 items-stretch">
          <div className="flex flex-1 gap-4 min-w-0">
            <div className="value-card flex-1" style={{ fontSize:'20px', lineHeight:1.15, padding:'18px 20px' }}>
              <div style={{ fontWeight:700, fontSize:'16px', marginBottom:4 }}>Total Cash Savings</div>
              <div style={{ fontWeight:700, fontSize:'24px' }}>${gameState.cash.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
            </div>
            <div className="value-card flex-1" style={{ fontSize:'20px', lineHeight:1.15, padding:'18px 20px' }}>
              <div style={{ fontWeight:700, fontSize:'16px', marginBottom:4 }}>Portfolio Total</div>
              <div style={{ fontWeight:700, fontSize:'24px' }}>${totalValue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
            </div>
          </div>
            <div className="value-card" style={{ width: 420, fontSize:'20px', lineHeight:1.15, padding:'18px 22px' }}>
              <div style={{ fontWeight:700, fontSize:'16px', marginBottom:4, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span>Net Profit</span>
                <span style={{ fontSize:'13px', fontWeight:600, opacity:0.7 }}>(excl. contributions)</span>
              </div>
              <div className={investmentProfit >= 0 ? 'text-green-700' : 'text-red-700'} style={{ fontWeight:700, fontSize:'26px' }}>${investmentProfit.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-10 mb-10">
          <div className="flex items-center gap-4">
            <span className="pm-btn" onClick={() => setInvestAmount(v => Math.max(0, v - 500))}>–</span>
            <div className="amount-box">{investAmount}</div>
            <span className="pm-btn" onClick={() => setInvestAmount(v => Math.min(gameState.cash, v + 500))}>+</span>
          </div>
        </div>
        <div className="action-grid mb-16">
          <div className="action-card" style={{ background: '#ff4545' }}>
            <div className="mb-4">
              <h3 className="text-2xl mb-2">Volatile ETF</h3>
              <p className="text-base font-semibold mb-1">Current Invested:</p>
              <p className="font-bold mb-2">${gameState.investments.volatileETF.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div>
              <div className="flex flex-col gap-3">
                <div className="invest-btn" onClick={() => executeHit('volatileETF')}>Hit</div>
                <div className="invest-btn" style={{ background:'#222' }} onClick={() => handlePlayerAction({ type:'WITHDRAW', etf:'volatileETF', amount: investAmount })}>Withdraw</div>
              </div>
            </div>
          </div>
          <div className="action-card stand" style={{ background: '#b7f879' }}>
            <div className="mb-4">
              <h3 className="text-2xl mb-2">Stand</h3>
              <p className="text-base font-semibold mb-1">Cash on Hand:</p>
              <p className="font-bold mb-2">${gameState.cash.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div>
              <div className="invest-btn" onClick={() => handlePlayerAction({ type: 'STAND' })}>Advance Quarter</div>
            </div>
          </div>
          <div className="action-card" style={{ background: '#ff4545' }}>
            <div className="mb-4">
              <h3 className="text-2xl mb-2">Long-Term ETF</h3>
              <p className="text-base font-semibold mb-1">Current Invested:</p>
              <p className="font-bold mb-2">${gameState.investments.longTermETF.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div>
              <div className="flex flex-col gap-3">
                <div className="invest-btn" onClick={() => executeHit('longTermETF')}>Hit</div>
                <div className="invest-btn" style={{ background:'#222' }} onClick={() => handlePlayerAction({ type:'WITHDRAW', etf:'longTermETF', amount: investAmount })}>Withdraw</div>
              </div>
            </div>
          </div>
        </div>
        <div className="value-grid mb-24" style={{ fontSize:'18px' }}>
          <div className="value-card" style={{ gridColumn: 'span 2 / auto', padding:'24px 28px', minHeight:140, display:'flex', alignItems:'center' }}>
            {lastEventResult ? (
              <>
                <div>
                  <p className="font-semibold mb-2" style={{ fontSize:'22px' }}>Last Quarter Result</p>
                  <p style={{ fontSize:'18px', lineHeight:1.3 }}>{lastEventResult.marketCondition} | Volatile {(lastEventResult.volatileReturn * 100).toFixed(1)}% | Long {(lastEventResult.longTermReturn * 100).toFixed(1)}%</p>
                </div>
              </>
            ) : <p style={{ fontSize:'22px', fontWeight:600 }}>Invest to see results next quarter.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}