import Link from 'next/link';
import Image from 'next/image';

export default function EtfDiversificationPage() {
  return (
    <main className="min-h-screen bg-board text-black flex flex-col items-center p-6">
      <div className="w-full max-w-[1250px]">
        <div className="pixel-panel mb-8 relative" style={{ padding:'48px 60px 56px' }}>
          <div className="absolute investy-resting" style={{ right:40, top:40, width:180, height:180 }}>
            <Image src="/assets/sprites/Investy- Resting-1.png.png" alt="Resting Investy" fill className="object-contain" priority />
          </div>
          <h1 className="text-5xl font-extrabold mb-6" style={{ letterSpacing:'1px', maxWidth:780 }}>Foundations: ETFs & Diversification</h1>
          <p className="text-xl leading-relaxed font-semibold mb-6 max-w-[900px]">
            Successful investing isn’t about guessing the next rocket ship stock. It is about building a resilient structure that can handle surprises. Two building blocks help: <span className="font-bold">diversification</span> and using broad, low cost <span className="font-bold">ETFs</span> (Exchange-Traded Funds).
          </p>
          <h2 className="text-4xl font-extrabold mb-4">What Is an ETF?</h2>
          <p className="text-lg font-medium leading-relaxed mb-4 max-w-[1000px]">
            An ETF is a <span className="font-semibold">bundle of many investments</span> (often hundreds of stocks) that trades like a single share. Instead of buying companies one by one, you grab a whole slice of a market or theme instantly. Examples of broad core ETFs include <span className="font-semibold">VOO</span> or <span className="font-semibold">VTI</span>, which track large swaths of the U.S. market. More specialized or higher‑movement ETFs can include sector funds or growth/tech heavy funds like <span className="font-semibold">QQQ</span>.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="value-card" style={{ padding:'18px 20px' }}>
              <p className="font-bold mb-2 text-lg">Instant Mix</p>
              <p className="text-base font-medium leading-snug">Own many companies in one click; less dependence on a single outcome.</p>
            </div>
            <div className="value-card" style={{ padding:'18px 20px' }}>
              <p className="font-bold mb-2 text-lg">Lower Friction</p>
              <p className="text-base font-medium leading-snug">Avoid constant stock picking. Focus on allocation decisions.</p>
            </div>
            <div className="value-card" style={{ padding:'18px 20px' }}>
              <p className="font-bold mb-2 text-lg">Often Low Cost</p>
              <p className="text-base font-medium leading-snug">Broad index ETFs usually charge very small fees.</p>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold mb-4">Why Diversification Matters</h2>
          <p className="text-lg font-medium leading-relaxed mb-4 max-w-[1000px]">
            Diversification spreads your money across different holdings so that one stumble does not wreck your progress. It <span className="font-semibold">softens volatility</span> and helps you emotionally stay invested. That is critical for long term compounding.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="value-card" style={{ padding:'22px 26px' }}>
              <p className="font-bold mb-3 text-lg">Without Diversification</p>
              <ul className="list-disc pl-5 text-base font-medium space-y-1">
                <li>Heavily tied to a single story</li>
                <li>Sharp drops feel catastrophic</li>
                <li>Greater temptation to panic sell</li>
              </ul>
            </div>
            <div className="value-card" style={{ padding:'22px 26px' }}>
              <p className="font-bold mb-3 text-lg">With Diversification</p>
              <ul className="list-disc pl-5 text-base font-medium space-y-1">
                <li>Losses in one area can be buffered</li>
                <li>Smoother performance pattern</li>
                <li>Easier to stick with the plan</li>
              </ul>
            </div>
          </div>
          <div className="pixel-panel mb-10" style={{ background:'#fff', border:'3px solid #000', padding:'26px 32px' }}>
            <p className="font-bold text-2xl mb-3">Simple Analogy</p>
            <p className="text-lg font-medium leading-snug mb-2">Putting everything in one stock is like building a table with a single leg. It looks fine until a wobble hits.</p>
            <p className="text-lg font-medium leading-snug mb-2">Using a diversified ETF is like using many sturdy legs. One weak spot? The table still stands.</p>
            <p className="text-lg font-medium leading-snug">Add multiple types of ETFs and you now have layers of stability supporting growth.</p>
          </div>
          <h2 className="text-3xl font-extrabold mb-4">Volatile vs Long-Term Style ETFs</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="value-card" style={{ padding:'20px 24px' }}>
              <p className="font-bold text-lg mb-2">Higher-Volatility Examples</p>
              <ul className="list-disc pl-5 text-sm font-medium space-y-1">
                <li>Tech-heavy growth (e.g., QQQ)</li>
                <li>Sector-focused (e.g., semiconductor, biotech)</li>
                <li>Thematic trends (AI, clean energy)</li>
                <li>More return potential, wider swings</li>
              </ul>
            </div>
            <div className="value-card" style={{ padding:'20px 24px' }}>
              <p className="font-bold text-lg mb-2">Core Long-Term Examples</p>
              <ul className="list-disc pl-5 text-sm font-medium space-y-1">
                <li>Broad S&P 500 (VOO)</li>
                <li>Total Market (VTI)</li>
                <li>Large diversified blends</li>
                <li>Steadier compounding base</li>
              </ul>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-4">Micro Glossary</h2>
          <div className="grid md:grid-cols-3 gap-5 mb-10 text-sm font-medium">
            <div className="value-card" style={{ padding:'14px 16px' }}>
              <p className="font-bold mb-1">Risk</p>
              <p>Chance of outcomes differing from what you expect.</p>
            </div>
            <div className="value-card" style={{ padding:'14px 16px' }}>
              <p className="font-bold mb-1">Return</p>
              <p>Growth (or loss) generated by an investment.</p>
            </div>
            <div className="value-card" style={{ padding:'14px 16px' }}>
              <p className="font-bold mb-1">Volatility</p>
              <p>How widely prices swing up and down.</p>
            </div>
            <div className="value-card" style={{ padding:'14px 16px' }}>
              <p className="font-bold mb-1">Allocation</p>
              <p>How you split money across choices.</p>
            </div>
            <div className="value-card" style={{ padding:'14px 16px' }}>
              <p className="font-bold mb-1">Compounding</p>
              <p>Growth building on prior growth over time.</p>
            </div>
            <div className="value-card" style={{ padding:'14px 16px' }}>
              <p className="font-bold mb-1">Diversification</p>
              <p>Not depending on one outcome to succeed.</p>
            </div>
          </div>
          <div className="pixel-panel mb-10" style={{ background:'#fff', border:'3px solid #000', padding:'26px 32px' }}>
            <p className="font-bold text-2xl mb-3">Key Takeaways</p>
            <ul className="list-disc pl-6 text-base font-medium space-y-1">
              <li>ETFs give you instant diversification.</li>
              <li>Mixing core + higher-volatility layers can balance growth & stability.</li>
              <li>Staying invested calmly matters more than perfect timing.</li>
            </ul>
          </div>
          <p className="text-sm font-medium opacity-70 mb-8">Tickers (VOO, VTI, QQQ) shown for illustration only. This is educational, not investment advice.</p>
          <div className="flex flex-wrap gap-6 items-center">
            <Link href="/" className="invest-btn" style={{ background:'#444' }}>Back</Link>
            <Link href="/learn/game-overview" className="invest-btn">Next: How The Game Works →</Link>
            <Link href="/game" className="invest-btn" style={{ background:'#c62828' }}>Skip to Game</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
