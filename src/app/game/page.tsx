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

  // (Removed prior sector-specific supplemental lines for more indirect news tone)

  // News-style blurbs categorized by sentiment
  const newsBlurbs = {
    euphoric: [
      'Several large product launches draw long lines in major cities.',
      'Conference chatter highlights upbeat tone among hardware vendors.',
      'Industry surveys show hiring plans inching higher.'
    ],
    positive: [
      'Analysts note steady order backlogs across multiple groups.',
      'Management call transcripts mention cautious optimism.',
      'Incremental cost pressures appear to be easing.'
    ],
    neutral: [
      'Executives reiterate prior full-year outlook without changes.',
      'Media coverage focuses on incremental feature rollouts.',
      'Market participants await upcoming data releases.'
    ],
    caution: [
      'Commentary points to selective budget reviews before year-end.',
      'Some firms reference slower deal approvals in internal notes.',
      'Shipping timelines get modestly extended in certain categories.'
    ],
    negative: [
      'Reports surface of postponed expansion plans at a few mid-sized firms.',
      'Procurement teams flag tighter discretionary spending controls.',
      'Channel partners mention lighter-than-expected reorders.'
    ],
    panic: [
      'Emergency cost containment steps circulate in internal memos.',
      'Vendors discuss accelerated inventory clearance efforts.',
      'Hiring pauses broaden to more departments.'
    ]
  } as const;

  // Deterministic pick per quarter based on year+quarter hash to keep stable on re-renders
  function pickNewsBlurb(vRet: number, lRet: number): string | null {
    const keySeed = (gameState.year * 10 + gameState.quarter);
    let bucket: keyof typeof newsBlurbs | null = null;
    if (vRet >= 0.18) bucket = 'euphoric';
    else if (vRet >= 0.08) bucket = 'positive';
    else if (vRet >= 0.02) bucket = 'neutral';
    else if (vRet > -0.05) bucket = 'caution';
    else if (vRet > -0.20) bucket = 'negative';
    else bucket = 'panic';
    const arr = newsBlurbs[bucket];
    const index = keySeed % arr.length;
    return arr[index];
  }

  const newsLine = currentEvent ? pickNewsBlurb(currentEvent.returns.volatileETF, currentEvent.returns.longTermETF) : null;
  // Build small bullet list (2 items) from remaining pool excluding the chosen headline
  let newsBullets: string[] = [];
  if (currentEvent) {
    const vRet = currentEvent.returns.volatileETF;
    const bucket = vRet >= 0.18 ? 'euphoric' : vRet >= 0.08 ? 'positive' : vRet >= 0.02 ? 'neutral' : vRet > -0.05 ? 'caution' : vRet > -0.20 ? 'negative' : 'panic';
    const arr = newsBlurbs[bucket];
    const headline = newsLine;
    newsBullets = arr.filter(b => b !== headline).slice(0,2);
  }

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
        <div className="pixel-panel mb-6 inline-block font-bold" style={{ fontSize:'26px', padding:'14px 34px', minWidth:260, textAlign:'center' }}>
          Year {gameState.year} / Q{gameState.quarter}
        </div>
        <div className="layout-grid mb-6">
          <div>
            {/* Keep the original graph placeholder footprint, overlay the chart absolutely inside it */}
            <div className="graph-placeholder" style={{ position: 'relative' }}>
              {/* Chart overlay fills the box exactly without changing layout */}
              <div style={{ position: 'absolute', inset: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={gameState.portfolioHistory.map(ph => ({
                      label: ph.year === 0 ? 'Start' : `Y${ph.year}`,
                      portfolio: ph.value,
                      savingsOnly: (gameState.savingsHistory.find(s => s.year === ph.year)?.value ?? null),
                    }))}
                    margin={{ top: 8, right: 12, left: 12, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `$${(Number(v) / 1000)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: any, name: any) => [`$${Number(value).toFixed(2)}`, name]} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="portfolio" name="Portfolio" stroke="#1976D2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="savingsOnly" name="Savings Only" stroke="#8884d8" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} strokeDasharray="6 4" connectNulls={true} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Keep the visible placeholder label for accessibility/visual design (behind the chart) */}
              <div aria-hidden style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', color: 'rgba(0,0,0,0.12)', fontWeight: 700 }}>
                Graph
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start gap-10">
            <div className="speech-bubble w-full min-h-[320px] flex items-start justify-start" style={{ padding:'50px 60px', position:'relative', textAlign:'left' }}>
              <div style={{ width:'100%' }}>
                {currentEvent ? (
                  <>
                    <p className="mb-5" style={{ fontSize:'40px', fontWeight:800, letterSpacing:'0.5px' }}>Insight</p>
                    <p className="max-w-[1000px] mb-6" style={{ fontSize:'28px', lineHeight:1.45, fontWeight:600 }}>{currentEvent.houseInsight}</p>
                    {newsLine && (
                      <div className="max-w-[1000px] mt-5" style={{ fontSize:'22px', lineHeight:1.45, fontWeight:500 }}>
                        <p style={{ fontWeight:800, marginBottom:10, fontSize:'26px', letterSpacing:'0.3px' }}>News Snapshot</p>
                        <ul style={{ listStyle:'disc', paddingLeft: '1.6rem' }}>
                          <li>{newsLine}</li>
                          {newsBullets.map((b,i)=>(<li key={i}>{b}</li>))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : <p style={{ fontSize:'20px' }}>...</p>}
              </div>
              <img
                src="/assets/sprites/Investy- Info-1.png.png"
                alt="Investy"
                className="investy-info"
                style={{
                  position:'absolute',
                  bottom:-200,
                  right:30,
                  width:260,
                  imageRendering:'pixelated'
                }}
              />
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
        <div className="value-grid mb-12" style={{ fontSize:'18px' }}>
          <div className="value-card" style={{ gridColumn: 'span 2 / auto', padding:'26px 32px', minHeight:150, display:'flex', alignItems:'center' }}>
            {lastEventResult ? (() => {
              const v = lastEventResult.volatileReturn;
              const l = lastEventResult.longTermReturn;
              const cond = lastEventResult.marketCondition;
              // Build an educational description
              let descriptor = '';
              if (v >= 0.15) descriptor = 'Momentum stayed strong; high‑beta positions rewarded investors who accepted larger swings.';
              else if (v >= 0.05) descriptor = 'A constructive quarter: risk assets inched higher while steadier holdings compounded gradually.';
              else if (v >= -0.02) descriptor = 'Markets were essentially flat overall; diversification helped keep results calm.';
              else if (v >= -0.08) descriptor = 'A modest pullback reminded investors that short‑term declines are normal in pursuit of long‑term growth.';
              else if (v >= -0.18) descriptor = 'A risk‑off phase pressured volatile holdings; balanced exposure limited deeper losses.';
              else descriptor = 'A sharp drawdown tested risk tolerance; sticking to a plan can prevent emotional decisions.';
              const diversification = l > v ? 'Long‑term ETF outperformed, cushioning variability.' : l < v ? 'Volatile ETF led performance, adding return but with higher noise.' : 'Both ETFs moved in lockstep this quarter.';
              return (
                <div style={{ textAlign:'left' }}>
                  <p className="font-semibold mb-3" style={{ fontSize:'22px' }}>Last Quarter Result</p>
                  <p style={{ fontSize:'20px', lineHeight:1.4, marginBottom:12, fontWeight:600 }}>{descriptor} {diversification}</p>
                  <p style={{ fontSize:'20px', fontWeight:700, letterSpacing:'0.3px' }}>Condition: <span style={{ fontWeight:800 }}>{cond}</span> | Volatile <span style={{ fontWeight:800 }}>{(v * 100).toFixed(1)}%</span> | Long <span style={{ fontWeight:800 }}>{(l * 100).toFixed(1)}%</span></p>
                </div>
              );
            })() : <p style={{ fontSize:'22px', fontWeight:600 }}>Invest to see results next quarter.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}