
import { Brain } from 'lucide-react';

export const BrandLogo = ({ size = 36 }: { size?: number }) => (
  <span className="relative inline-flex items-center justify-center mr-2">
    <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 blur-[8px] opacity-60"></span>
    <span className="relative z-10 bg-black rounded-full p-2 shadow-lg shadow-cyan-300/20 border border-white/10">
      <Brain size={size} className="text-white drop-shadow" />
    </span>
  </span>
);
