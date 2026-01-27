"use client";

export default function NoiseOverlay() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay overflow-hidden">
        <div className="absolute top-[-50%] left-[-50%] right-[-50%] bottom-[-50%] w-[200%] h-[200%] bg-repeat bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-grain"></div>
    </div>
  );
}
