
import React from 'react';

interface HeroSplitProps {
  title: string;
  subtitle: string;
  visual?: React.ReactNode;
  children?: React.ReactNode;
}

export const HeroSplit = ({ title, subtitle, visual, children }: HeroSplitProps) => (
  <section className="flex flex-col md:flex-row min-h-[80vh] w-full relative overflow-hidden">
    <div className="flex-1 bg-gradient-to-b from-[#12172a] via-[#2c2945] to-[#191e36] flex flex-col justify-center items-end py-16 px-6 md:px-16 z-10">
      <div className="max-w-xl flex flex-col items-end">
        <h1 className="text-5xl lg:text-7xl font-extrabold leading-none font-orbitron text-white tracking-tight drop-shadow-xl text-right">
          {title}
        </h1>
        <p className="mt-5 mb-12 text-xl text-right text-blue-200 max-w-sm font-sora">{subtitle}</p>
        <div>{children}</div>
      </div>
    </div>
    <div className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-cyan-900/80 to-fuchsia-900/30">
      <div className="absolute inset-0 z-[-1] pointer-events-none">
        {/* big floating orbs for style */}
        <div className="absolute top-14 right-16 w-64 h-64 bg-fuchsia-500/40 rounded-full blur-2xl opacity-60 animate-pulse" />
        <div className="absolute bottom-0 left-10 w-52 h-52 bg-cyan-400/25 rounded-full blur-2xl opacity-75 animate-pulse" />
      </div>
      <div className="relative">
        {visual}
      </div>
    </div>
  </section>
);
