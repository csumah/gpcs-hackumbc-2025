"use client";

import { useState } from 'react';
import { initializeGame, processQuarter, PlayerState, PlayerAction, gameData } from '@/lib/gamelogic';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      <main className="game-over-main bg-board text-black">
        <div className="pixel-panel game-over-frame">
          <h1 className="game-over-title">Game Over!</h1>

          <div className="game-over-stats">
            <div className="value-card game-over-stat-card">
              <p className="game-over-stat-label">Final Portfolio Value</p>
              <p className="game-over-stat-value">${totalValue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div className="value-card game-over-stat-card">
              <p className="game-over-stat-label">Total Contributions</p>
              <p className="game-over-stat-value">${contributed.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
            </div>
            <div className="value-card game-over-stat-card">
              <p className="game-over-stat-label">Net Profit</p>
              <p className={`game-over-stat-value ${investmentProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                ${investmentProfit.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
              </p>
            </div>
          </div>

          <div className="game-over-chart">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={finalChartData} margin={{ top: 10, right: 18, left: 4, bottom: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${(Number(v) / 1000)}k`} tick={{ fontSize: 12 }} width={56} />
                <Tooltip formatter={(value: any, name: any) => [`$${Number(value).toFixed(2)}`, name]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="cash" name="Cash (available)" stroke="#4CAF50" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="invested" name="Invested" stroke="#FFA726" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="portfolio" name="Portfolio Value" stroke="#1976D2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="savingsOnly" name="Savings Only" stroke="#8884d8" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} strokeDasharray="6 4" connectNulls={true} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="game-over-footer">
            <div className="game-over-holdings">
              <div className="value-card game-over-holding-card">
                <p className="game-over-holding-label">Volatile ETF</p>
                <p className="game-over-holding-value">${gameState.investments.volatileETF.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
              </div>
              <div className="value-card game-over-holding-card">
                <p className="game-over-holding-label">Long-Term ETF</p>
                <p className="game-over-holding-value">${gameState.investments.longTermETF.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
              </div>
              <div className="value-card game-over-holding-card">
                <p className="game-over-holding-label">Cash</p>
                <p className="game-over-holding-value">${gameState.cash.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
              </div>
            </div>

            <div className="game-over-cta">
              <a href="/postgame/limits" className="invest-btn game-over-continue">Continue →</a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="game-main bg-board text-black">
      <div className="game-frame">
        <div className="game-header-row">
          <div className="pixel-panel game-quarter-badge">
            Year {gameState.year} / Q{gameState.quarter}
          </div>
        </div>

        <div className="game-dashboard">
          <div className="graph-placeholder game-graph-panel">
            <div className="game-chart-surface">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={gameState.portfolioHistory.map(ph => ({
                    label: ph.year === 0 ? 'Start' : `Y${ph.year}`,
                    portfolio: ph.value,
                    savingsOnly: (gameState.savingsHistory.find(s => s.year === ph.year)?.value ?? null),
                  }))}
                  margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `$${(Number(v) / 1000)}k`} tick={{ fontSize: 12 }} width={52} />
                  <Tooltip formatter={(value: any, name: any) => [`$${Number(value).toFixed(2)}`, name]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="portfolio" name="Portfolio" stroke="#1976D2" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="savingsOnly" name="Savings Only" stroke="#8884d8" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} strokeDasharray="6 4" connectNulls={true} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="speech-bubble game-insight-panel">
            <div className="game-insight-copy">
              {currentEvent ? (
                <>
                  <p className="game-insight-title">Insight</p>
                  <p className="game-insight-text">{currentEvent.houseInsight}</p>
                  {newsLine && (
                    <div className="game-news">
                      <p className="game-news-title">News Snapshot</p>
                      <ul className="game-news-list">
                        <li>{newsLine}</li>
                        {newsBullets.map((b, i) => (<li key={i}>{b}</li>))}
                      </ul>
                    </div>
                  )}
                </>
              ) : <p className="game-insight-text">...</p>}
            </div>

            <img
              src="/assets/sprites/Investy- Info-1.png.png"
              alt="Investy"
              className="investy-info game-investy"
            />
          </div>
        </div>

        <div className="game-status-row">
          <div className="pixel-panel game-amount-panel">
            <div className="game-amount-label">Investment Amount</div>
            <div className="game-amount-controls">
              <span className="pm-btn" onClick={() => setInvestAmount(v => Math.max(0, v - 500))}>-</span>
              <div className="amount-box">${investAmount.toLocaleString()}</div>
              <span className="pm-btn" onClick={() => setInvestAmount(v => Math.min(gameState.cash, v + 500))}>+</span>
            </div>
          </div>

          <div className="value-card game-stat-card">
            <div className="game-stat-label">Total Cash Savings</div>
            <div className="game-stat-value">${gameState.cash.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
          </div>

          <div className="value-card game-stat-card">
            <div className="game-stat-label">Portfolio Total</div>
            <div className="game-stat-value">${totalValue.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
          </div>

          <div className="value-card game-stat-card">
            <div className="game-stat-label">Net Profit <span className="game-profit-note">(excl. contributions)</span></div>
            <div className={`game-stat-value ${investmentProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              ${investmentProfit.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
            </div>
          </div>
        </div>

        <div className="action-grid game-action-grid">
          <div className="action-card game-action-card" style={{ background: '#ff4545' }}>
            <div className="game-action-body">
              <div>
                <h3>Volatile ETF</h3>
                <p className="game-card-label">Current Invested</p>
                <p className="game-card-value">${gameState.investments.volatileETF.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
              </div>
              <div className="game-action-buttons">
                <div className="invest-btn game-invest-btn" onClick={() => executeHit('volatileETF')}>Hit</div>
                <div className="invest-btn game-invest-btn" style={{ background:'#222' }} onClick={() => handlePlayerAction({ type:'WITHDRAW', etf:'volatileETF', amount: investAmount })}>Withdraw</div>
              </div>
            </div>
          </div>

          <div className="action-card stand game-action-card" style={{ background: '#b7f879' }}>
            <div className="game-action-body">
              <div>
                <h3>Stand</h3>
                <p className="game-card-label">Cash on Hand</p>
                <p className="game-card-value">${gameState.cash.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
              </div>
              <div className="game-action-buttons">
                <div className="invest-btn game-invest-btn" onClick={() => handlePlayerAction({ type: 'STAND' })}>Advance Quarter</div>
              </div>
            </div>
          </div>

          <div className="action-card game-action-card" style={{ background: '#ff4545' }}>
            <div className="game-action-body">
              <div>
                <h3>Long-Term ETF</h3>
                <p className="game-card-label">Current Invested</p>
                <p className="game-card-value">${gameState.investments.longTermETF.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</p>
              </div>
              <div className="game-action-buttons">
                <div className="invest-btn game-invest-btn" onClick={() => executeHit('longTermETF')}>Hit</div>
                <div className="invest-btn game-invest-btn" style={{ background:'#222' }} onClick={() => handlePlayerAction({ type:'WITHDRAW', etf:'longTermETF', amount: investAmount })}>Withdraw</div>
              </div>
            </div>
          </div>
        </div>

        <div className="value-card game-recap-card">
          {lastEventResult ? (() => {
            const v = lastEventResult.volatileReturn;
            const l = lastEventResult.longTermReturn;
            const cond = lastEventResult.marketCondition;
            let descriptor = '';
            if (v >= 0.15) descriptor = 'Momentum stayed strong; high-beta positions rewarded investors who accepted larger swings.';
            else if (v >= 0.05) descriptor = 'A constructive quarter: risk assets inched higher while steadier holdings compounded gradually.';
            else if (v >= -0.02) descriptor = 'Markets were essentially flat overall; diversification helped keep results calm.';
            else if (v >= -0.08) descriptor = 'A modest pullback reminded investors that short-term declines are normal in pursuit of long-term growth.';
            else if (v >= -0.18) descriptor = 'A risk-off phase pressured volatile holdings; balanced exposure limited deeper losses.';
            else descriptor = 'A sharp drawdown tested risk tolerance; sticking to a plan can prevent emotional decisions.';

            const diversification = l > v
              ? 'Long-term ETF outperformed, cushioning variability.'
              : l < v
                ? 'Volatile ETF led performance, adding return but with higher noise.'
                : 'Both ETFs moved in lockstep this quarter.';

            return (
              <div className="game-recap-copy">
                <p className="game-recap-title">Last Quarter Result</p>
                <p className="game-recap-body">{descriptor} {diversification}</p>
                <p className="game-recap-metrics">
                  Condition: <span>{cond}</span> | Volatile <span>{(v * 100).toFixed(1)}%</span> | Long <span>{(l * 100).toFixed(1)}%</span>
                </p>
              </div>
            );
          })() : <p className="game-recap-empty">Invest to see results next quarter.</p>}
        </div>
      </div>
    </main>
  );
}
