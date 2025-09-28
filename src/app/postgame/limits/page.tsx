import Link from 'next/link';

export default function SimulationLimitsPage(){
  return (
    <main className="min-h-screen bg-board text-black flex flex-col items-center p-6">
      <div className="w-full max-w-[1250px]">
        <div className="pixel-panel mb-8" style={{ padding:'50px 60px 58px' }}>
          <h1 className="text-5xl font-extrabold mb-6" style={{letterSpacing:'1px'}}>Before You Dive Back In</h1>
          <p className="text-xl font-semibold leading-relaxed mb-8 max-w-[1000px]">This simulation teaches core ideas: diversification, position sizing, incremental allocation, and keeping emotion in check. Real markets include many layers we are not modeling. Knowing the limits helps you set proper expectations.</p>

          <h2 className="text-3xl font-extrabold mb-4">What We Kept Simple On Purpose</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="value-card" style={{ padding:'20px 22px' }}>
              <p className="font-bold text-lg mb-2">1. Randomness</p>
              <p className="text-base font-medium leading-snug">Real markets jump around in ways you cannot predict. Here the results are pre set so you can focus on choices.</p>
            </div>
            <div className="value-card" style={{ padding:'20px 22px' }}>
              <p className="font-bold text-lg mb-2">2. Market Moods</p>
              <p className="text-base font-medium leading-snug">In real life calm periods can turn rough suddenly. We keep one simple pattern instead of changing moods mid game.</p>
            </div>
            <div className="value-card" style={{ padding:'20px 22px' }}>
              <p className="font-bold text-lg mb-2">3. Fees and Dividends</p>
              <p className="text-base font-medium leading-snug">Real ETFs pay small dividends and charge small annual fees. We ignore those to keep the math clean.</p>
            </div>
            <div className="value-card" style={{ padding:'20px 22px' }}>
              <p className="font-bold text-lg mb-2">4. Taxes</p>
              <p className="text-base font-medium leading-snug">In the real world selling can create taxable gains. We leave taxes out so you learn the core flow first.</p>
            </div>
            <div className="value-card" style={{ padding:'20px 22px' }}>
              <p className="font-bold text-lg mb-2">5. Rebalancing</p>
              <p className="text-base font-medium leading-snug">Portfolios can drift and need trimming. Here you just adjust by hand if one side gets large.</p>
            </div>
            <div className="value-card" style={{ padding:'20px 22px' }}>
              <p className="font-bold text-lg mb-2">6. Risk Stats</p>
              <p className="text-base font-medium leading-snug">Real investors track swings, biggest drops, and risk ratios. We only show your amounts and profit.</p>
            </div>
            <div className="value-card" style={{ padding:'20px 22px' }}>
              <p className="font-bold text-lg mb-2">7. Big Surprises</p>
              <p className="text-base font-medium leading-snug">News shocks or sudden crashes are not modeled. Each quarter is steady inside the number you see.</p>
            </div>
            <div className="value-card" style={{ padding:'20px 22px' }}>
              <p className="font-bold text-lg mb-2">8. Moving Together</p>
              <p className="text-base font-medium leading-snug">In stress many things drop at once. We keep the two layers simple instead of modeling that change.</p>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-4">Quick Reminders</h2>
          <ul className="list-disc pl-6 text-base font-medium space-y-2 mb-10 max-w-[1000px]">
            <li><span className="font-bold">Education Only:</span> This is a practice environment.</li>
            <li><span className="font-bold">No Future Telling:</span> Insight and News are teaching flavor, not signals.</li>
            <li><span className="font-bold">Simple Setup:</span> Real portfolios can include bonds, cash buckets, and more regions.</li>
            <li><span className="font-bold">Hidden Bumps:</span> Real prices move inside a quarter even if here you just see one result.</li>
            <li><span className="font-bold">Process First:</span> Good habits beat guessing short term moves.</li>
          </ul>

          <p className="text-sm font-medium opacity-70 mb-8">Real markets add noise, costs, taxes, and surprises. Use this to practice steady decision making, then keep learning.</p>
          <div className="flex flex-wrap gap-6 items-center">
            <Link href="/game" className="invest-btn">Start New Simulation →</Link>
            <Link href="/" className="invest-btn" style={{ background:'#444' }}>Home</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
