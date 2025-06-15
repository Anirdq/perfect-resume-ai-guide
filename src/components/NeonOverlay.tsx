
import React from 'react';

export const NeonOverlay = () => (
  <>
    {/* Floating futuristic "neon" blobs */}
    <div className="pointer-events-none fixed top-[7vh] left-[18vw] w-[320px] h-[150px] rounded-full bg-gradient-to-r from-fuchsia-500/15 to-blue-400/10 blur-3xl opacity-60 animate-pulse z-10" />
    <div className="pointer-events-none fixed bottom-[8vh] right-[7vw] w-[270px] h-[110px] rounded-full bg-gradient-to-l from-cyan-500/10 to-fuchsia-400/15 blur-3xl opacity-50 animate-pulse z-10" />
    <div className="pointer-events-none fixed left-1/2 top-0 w-[50vw] h-[120px] bg-gradient-to-tr from-cyan-400/20 to-fuchsia-400/5 blur-2xl opacity-25" style={{transform:"translateX(-50%)"}} />
  </>
);
