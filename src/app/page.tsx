import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start pt-[6vh] bg-board text-white p-6 select-none">
      {/* House character sprite (now only on title screen) */}
      <div className="pixel-art house-sprite pointer-events-none">
        <Image
          src="/assets/sprites/Investy - Resting-1.png.png"
          alt="The House"
          fill
          className="object-contain"
          priority
        />
      </div>
      {/* Title */}
      <div
        className="relative pixel-art"
        style={{
          // Increased by ~150px on min & max
          width: "clamp(550px, 60vw, 1050px)",
          aspectRatio: "5 / 3",
        }}
      >
        <Image
          src="/assets/ui/hit-or-holdings-title.png"
          alt="Hit or Holdings"
          fill
          className="object-contain"
          priority
        />
      </div>
      {/* Start button (Option E narrower for hierarchy) */}
      <Link
        href="/game"
        aria-label="Start Game"
        className="pixel-art start-btn"
        style={{
          marginTop: "clamp(40px, 6vh, 96px)",
          // Increased by ~140-160px; remain narrower than title
          width: "clamp(460px, 46vw, 780px)",
          aspectRatio: "13 / 3",
          position: "relative",
        }}
      >
        <Image
          src="/assets/ui/button-start.png"
          alt="Start"
          fill
          className="object-contain"
          priority
        />
      </Link>
    </main>
  );
}
