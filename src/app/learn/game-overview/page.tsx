import Link from 'next/link';
import Image from 'next/image';

export default function GameOverviewPage() {
  return (
    <main className="min-h-screen bg-board text-black flex flex-col items-center p-6">
      <div className="w-full max-w-[1250px]">
        <div className="pixel-panel mb-8 relative" style={{ padding:'52px 64px 60px', overflow:'hidden' }}>
          <div className="absolute investy-nervous" style={{ right:40, top:40, width:150, height:150 }}>
            <Image src="/assets/sprites/Investy- Nervous-1.png.png" alt="Nervous Investy" fill className="object-contain" priority />
          </div>
          <h1 className="text-5xl font-extrabold mb-6" style={{ letterSpacing:'1px', maxWidth:820 }}>How the Simulation Works</h1>
          <p className="text-xl font-semibold leading-relaxed mb-6 max-w-[1000px]" style={{ paddingRight:200 }}>
            This builds directly on what you just learned. You will balance a steadier <span className="font-bold">long term ETF layer</span> with a more <span className="font-bold">volatile growth layer</span>. Your decisions happen inside quarters; only when you <span className="font-bold">Stand</span> does time move and results lock in.
          </p>
          <h2 className="text-4xl font-extrabold mb-5">Core Actions</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="value-card" style={{ padding:'20px 22px' }}>
              <p className="font-bold mb-2 text-lg">Hit (Invest)</p>
              <p className="text-base font-medium leading-snug">Allocate cash into the chosen ETF. Do multiple small hits to simulate gradual entry (dollar-cost style).</p>
            </div>
            <div className="value-card" style={{ padding:'20px 22px' }}>
              <p className="font-bold mb-2 text-lg">Withdraw</p>
              <p className="text-base font-medium leading-snug">Pull funds back to cash if allocation feels stretched before locking the quarter.</p>
            </div>
            <div className="value-card" style={{ padding:'20px 22px' }}>
              <p className="font-bold mb-2 text-lg">Stand</p>
              <p className="text-base font-medium leading-snug">Applies returns, inflation effects, adds your automatic contribution, advances to the next quarter.</p>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-5">Mapping Concepts → Mechanics</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="value-card" style={{ padding:'22px 26px' }}>
              <p className="font-bold text-lg mb-2">Diversification Principle</p>
              <p className="text-base font-medium leading-snug">Use the long term ETF as the base (VOO/VTI style). Layer volatility with the growth ETF carefully. Do not let it dominate when conditions are uncertain.</p>
            </div>
            <div className="value-card" style={{ padding:'22px 26px' }}>
              <p className="font-bold text-lg mb-2">Volatility Management</p>
              <p className="text-base font-medium leading-snug">Multiple small hits let you average in rather than guessing a single “perfect” entry point.</p>
            </div>
            <div className="value-card" style={{ padding:'22px 26px' }}>
              <p className="font-bold text-lg mb-2">Emotional Anchor</p>
              <p className="text-base font-medium leading-snug">Having a core layer reduces panic if the volatile layer swings. This mirrors real-world behavioral benefits.</p>
            </div>
            <div className="value-card" style={{ padding:'22px 26px' }}>
              <p className="font-bold text-lg mb-2">Capital Deployment Rhythm</p>
              <p className="text-base font-medium leading-snug">Contributions only apply when you Stand. This reinforces the tradeoff between waiting or advancing time.</p>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-5">Behind the Numbers</h2>
          <ul className="list-disc pl-6 text-base font-medium space-y-2 mb-10 max-w-[1000px]">
            <li><span className="font-bold">Quarterly Contribution:</span> +$2,500 only when you Stand (time passes).</li>
            <li><span className="font-bold">Net Profit:</span> (Cash + ETFs) − (Initial $10,000 + Contributions).</li>
            <li><span className="font-bold">Volatile ETF Layer:</span> More potential return, more noise (think QQQ / thematic).</li>
            <li><span className="font-bold">Long-Term ETF Layer:</span> Broad diversified base (VOO / VTI style) compounds quietly.</li>
            <li><span className="font-bold">News & Insight:</span> Gives tone for the quarter. Use it as context, not a guarantee.</li>
          </ul>
          <div className="pixel-panel mb-12" style={{ background:'#fff', border:'3px solid #000', padding:'24px 30px' }}>
            <p className="font-bold text-2xl mb-3">About Insights & News</p>
            <p className="text-base font-medium leading-snug mb-2">In real markets there are many analysts, commentators, newsletters, and headline feeds. They can sound confident, but nobody can see the future. Even correct sounding logic can be derailed by surprise events.</p>
            <p className="text-base font-medium leading-snug mb-2">The <span className="font-semibold">Insight</span> in this game gives a simplified educational angle. The <span className="font-semibold">News Snapshot</span> mimics how real world headlines shape mood. Sometimes news flows matter. Sometimes they distract. Treat them as signals to think, not commands to act.</p>
            <p className="text-base font-medium leading-snug">Focus on your allocation process. A consistent plan usually beats reactive headline chasing.</p>
          </div>
          <div className="pixel-panel mb-10" style={{ background:'#fff', border:'3px solid #000', padding:'26px 32px' }}>
            <p className="font-bold text-2xl mb-3">Strategy Layering</p>
            <p className="text-lg font-medium leading-snug mb-2">1. Establish a foundation in the long-term ETF.</p>
            <p className="text-lg font-medium leading-snug mb-2">2. Add the volatile ETF incrementally when conditions (or conviction) support risk.</p>
            <p className="text-lg font-medium leading-snug">3. Rebalance by withdrawing some if allocation drifts too aggressive before you Stand.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="value-card" style={{ padding:'22px 26px' }}>
              <p className="font-bold mb-3 text-lg">Common Mistake</p>
              <p className="text-base font-medium leading-snug">Going all in volatile immediately, then exiting emotionally after a dip.</p>
            </div>
            <div className="value-card" style={{ padding:'22px 26px' }}>
              <p className="font-bold mb-3 text-lg">Better Pattern</p>
              <p className="text-base font-medium leading-snug">Layer positions, observe, then Stand intentionally. Patience over prediction.</p>
            </div>
          </div>
          <div className="pixel-panel mb-10" style={{ background:'#fff', border:'3px solid #000', padding:'26px 32px' }}>
            <p className="font-bold text-2xl mb-3">Mindset Reminder</p>
            <p className="text-lg font-medium leading-snug mb-2">You cannot control short term results. You can control allocation and when you advance.</p>
            <p className="text-lg font-medium leading-snug">The goal is process quality: structured decisions, steady compounding.</p>
          </div>
          <p className="text-sm font-medium opacity-70 mb-8">Tickers used (VOO, VTI, QQQ) are examples only. Educational simulation—NOT investment advice.</p>
          <div className="flex flex-wrap gap-6 items-center">
            <Link href="/learn/etf-diversification" className="invest-btn" style={{ background:'#444' }}>Back</Link>
            <Link href="/game" className="invest-btn">Start Playing →</Link>
            <Link href="/game" className="invest-btn" style={{ background:'#c62828' }}>Skip</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
