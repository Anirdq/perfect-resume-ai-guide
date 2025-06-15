
import { Zap, Check, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  // Company logos (improved layout & responsiveness)
  const companyLogos = [
    { src: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Indeed_logo.png", alt: "Indeed" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/8/85/LinkedIn_Logo.svg", alt: "LinkedIn" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/7/75/Glassdoor_Logo_2014.png", alt: "Glassdoor" },
    { src: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Monster.com_logo.svg", alt: "Monster" },
  ];

  return (
    <section className="relative flex flex-col items-center w-full px-4 pt-20 md:pt-32 pb-16 overflow-hidden bg-white/70 animate-fade-in">
      <div className="inline-block animate-scale-in shadow-xl rounded-3xl p-2 mb-6 bg-white/90">
        <Zap className="text-blue-600 h-8 w-8" aria-label="AI Lightning bolt" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-blue-700 to-blue-400 bg-clip-text text-transparent mb-4 text-center max-w-3xl">
        Land More Interviews with AI-Optimized Resumes
      </h1>
      <p className="text-lg md:text-xl text-gray-700 font-medium mb-8 max-w-2xl mx-auto text-center">
        ResumeAI instantly analyzes and optimizes your resume — boosting your chances to get noticed by top employers.
      </p>
      <Button
        size="lg"
        className="text-lg md:text-xl font-semibold px-8 md:px-10 py-4 md:py-6 bg-blue-700 hover:bg-blue-800 shadow-2xl animate-pulse transition-all duration-300 mb-5"
        onClick={() => navigate("/resume")}
        aria-label="Upload Resume"
      >
        Upload Resume
      </Button>
      {/* Company logos — responsive carousel/grid */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center mt-8 mb-3">
        <span className="text-xs md:text-sm uppercase tracking-widest text-gray-400 font-semibold mb-2">
          Trusted by job seekers from companies like
        </span>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 w-full">
          {companyLogos.map(({ src, alt }) => (
            <img
              key={alt}
              src={src}
              alt={alt}
              className="h-7 md:h-9 object-contain grayscale opacity-80 transition hover:opacity-100 bg-white rounded px-2"
              style={{ maxWidth: 120 }}
              loading="lazy"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-center gap-3 items-center text-gray-500 mt-6 text-base animate-fade-in">
        <Check className="h-5 w-5 text-green-600 animate-bounce" aria-label="Checkmark" />
        <span>Fast. Secure. Free to start.</span>
      </div>
      {/* Down arrow for scroll cue */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:block">
        <ArrowDown className="h-7 w-7 text-blue-400 animate-bounce" />
      </div>
    </section>
  );
};
