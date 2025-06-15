
import React from "react";

/**
 * Spline-inspired Hero: Glassy + floating SVG blob + bold heading.
 */
const FloatingBlob = () => (
  <svg
    className="absolute left-1/2 -top-20 -translate-x-1/2 z-0"
    width="630"
    height="330"
    viewBox="0 0 630 330"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'blur(19px)', opacity: 0.8 }}
  >
    <defs>
      <radialGradient id="blobGradient" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stopColor="#36fdfe" />
        <stop offset="50%" stopColor="#a065ff" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#0fd8fc" stopOpacity="0.2"/>
      </radialGradient>
    </defs>
    <path
      d="M130,60 Q110,10 180,30 Q250,50 280,60 Q400,18 420,99 Q510,138 418,210 Q490,310 320,293 Q190,295 140,200 Q80,140 130,60 Z"
      fill="url(#blobGradient)"
      className="animate-blobby"
    />
  </svg>
);

export const SplineHero = () => (
  <section className="relative flex flex-col items-center justify-center min-h-[72vh] w-full overflow-hidden bg-gradient-to-tr from-[#191f2c] via-[#2a2954] to-[#180e30]">
    <FloatingBlob />
    <div className="relative z-10 flex flex-col items-center text-center pt-28 pb-20 px-5">
      <div className="max-w-3xl">
        <span className="inline-block bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-blue-200 bg-clip-text text-transparent font-orbitron text-2xl mb-3 tracking-wide">
          Next-Gen AI Tool
        </span>
        <h1 className="hero-glow-3xl mb-4">
          <span>Perfect Resume AI</span>
        </h1>
        <p className="hero-subtle mb-10 font-sora text-lg">
          Design & Optimize resumes with <span className="text-cyan-300 font-semibold">futuristic AI</span>. <br />
          Level-up your job-hunting with smart, beautiful results.
        </p>
        <button className="cta-glow px-9 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-cyan-500/30 hover:scale-[1.05] transition">
          Get Started Free
        </button>
      </div>
    </div>
    {/* Glassmorphism overlay card */}
    <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-5xl h-48 md:h-56 bg-white/10 backdrop-blur-[14px] rounded-[2.7rem] border border-cyan-200/25 shadow-2xl opacity-90 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
  </section>
);
