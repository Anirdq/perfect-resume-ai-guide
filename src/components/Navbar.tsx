
import React from "react";
import { BrandLogo } from "./BrandLogo";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => (
  <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 bg-white/70 backdrop-blur-[16px] border border-cyan-100/40 rounded-full shadow-xl px-7 py-[0.4rem] flex items-center gap-8 min-w-[330px] max-w-[95vw] mx-auto">
    <Link to="/" className="flex items-center gap-2">
      <BrandLogo size={28} />
      <span className="font-bold text-xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-blue-700 drop-shadow-sm select-none">ResumeAI</span>
    </Link>
    <div className="flex gap-6 ml-6 text-[1rem] font-medium text-cyan-700/80">
      <Link to="#how-it-works" className="hover-scale opacity-80 hover:opacity-100 transition">How it works</Link>
      <Link to="/pricing" className="hover-scale opacity-80 hover:opacity-100 transition">Pricing</Link>
    </div>
    <div className="ml-auto">
      <Button size="sm" className="bg-gradient-to-r from-cyan-500 via-fuchsia-400 to-blue-400 text-white font-semibold shadow-xl rounded-full px-7 py-2 text-base hover:scale-105">
        Try Free
      </Button>
    </div>
  </nav>
);
