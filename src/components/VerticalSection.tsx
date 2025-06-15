
import React from 'react';

interface VerticalSectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const VerticalSection = ({ label, children, className }: VerticalSectionProps) => (
  <section
    className={`flex flex-col md:flex-row max-w-5xl mx-auto my-16 py-8 md:py-16 bg-gradient-to-br from-zinc-900/90 via-[#24244c]/90 to-black/80 rounded-[2.5rem] border border-fuchsia-400/30 shadow-2xl relative overflow-hidden ${className ?? ''}`}
  >
    <div className="flex flex-col items-center md:items-start md:justify-center min-w-[88px] px-4 md:px-8 py-8 font-orbitron text-3xl uppercase tracking-[0.2em] text-cyan-400 absolute md:static left-2 top-0">
      <span className="border-l-4 border-cyan-400/50 pl-3 pb-2">{label}</span>
    </div>
    <div className="md:ml-[10rem] md:pl-4 w-full">{children}</div>
  </section>
);
