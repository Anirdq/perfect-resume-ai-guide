
import { Zap, Check, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="text-center px-4 py-16 flex flex-col items-center relative overflow-hidden animate-fade-in">
      <div className="inline-block animate-scale-in shadow-xl rounded-3xl p-2 mb-4 bg-white/70">
        <Zap className="text-blue-600 h-8 w-8 inline-block" aria-label="AI Lightning bolt" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-blue-700 to-blue-400 bg-clip-text text-transparent mb-3">
        Land More Interviews with AI-Optimized Resumes
      </h1>
      <p className="text-lg md:text-xl text-gray-700 font-medium mb-7 max-w-2xl mx-auto">
        ResumeAI instantly analyzes and optimizes your resume — boosting your chances to get noticed by top employers.
      </p>
      <Button
        size="lg"
        className="text-xl font-semibold px-10 py-6 bg-blue-700 hover:bg-blue-800 shadow-2xl animate-pulse transition-all duration-300"
        onClick={() => navigate("/resume")}
        aria-label="Upload Resume"
      >
        Upload Resume
      </Button>
      <div className="flex flex-row justify-center gap-3 items-center text-gray-500 mt-8 text-base animate-fade-in">
        <Check className="h-5 w-5 text-green-600 animate-bounce" aria-label="Checkmark" />
        <span>Fast. Secure. Free to start.</span>
      </div>
      {/* Down arrow for scroll cue */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <ArrowDown className="h-7 w-7 text-blue-400 animate-bounce" />
      </div>
    </section>
  );
};
