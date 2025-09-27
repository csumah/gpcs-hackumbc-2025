import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-14 bg-board text-white p-6">
      <div
        className="relative pixel-art"
        style={{
          width: "clamp(480px, 60vw, 840px)",
          height: "clamp(480px, 60vw, 840px)",
        }}
      >
        {/* Title image. Place file at public/assets/ui/hit-or-holdings-title.png */}
        <Image
          src="/assets/ui/hit-or-holdings-title.png"
          alt="Hit or Holdings"
          fill
          className="object-contain"
          priority
        />
      </div>
      <Link href="/game" className="btn-pixel select-none text-xl px-14 py-5">
        Start
      </Link>
    </main>
  );
}
