
import React from "react";
import { Zap, FileText, Star } from "lucide-react";
import { useState } from "react";
const DEMO_STEPS = [
  {
    icon: <FileText className="h-7 w-7 text-blue-500" />,
    title: "Upload",
    text: "Drag & drop your resume or paste it in seconds."
  },
  {
    icon: <Star className="h-7 w-7 text-yellow-500" />,
    title: "AI Analysis",
    text: "Smart algorithms pinpoint improvements & boost your score."
  },
  {
    icon: <Zap className="h-7 w-7 text-blue-700" />,
    title: "Optimize",
    text: "Instantly rewrite & download your enhanced resume."
  }
];

// Improved for responsiveness
export const DemoAnimation = () => {
  const [step, setStep] = useState(0);

  // Auto-cycle through demo steps
  React.useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % DEMO_STEPS.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="px-4 flex flex-col items-center animate-fade-in py-0 w-full">
      <div className="text-center mb-3">
        <span className="uppercase tracking-widest text-blue-500 font-bold text-xs">See ResumeAI in Action</span>
      </div>
      <div className="relative rounded-2xl bg-white/80 shadow-lg w-full max-w-xl mx-auto p-4 sm:p-8 min-h-[180px] flex flex-col items-center">
        <div className="mb-3 flex flex-row justify-center items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 p-3 shadow scale-110 transition-all animate-scale-in">
            {DEMO_STEPS[step].icon}
          </span>
          <span className="text-lg sm:text-xl font-bold text-blue-700">{DEMO_STEPS[step].title}</span>
        </div>
        <div className="text-gray-700 text-base sm:text-lg text-center">{DEMO_STEPS[step].text}</div>
        {/* Progress dots */}
        <div className="flex justify-center mt-6 gap-2">
          {DEMO_STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === step ? "bg-blue-600 scale-110" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
