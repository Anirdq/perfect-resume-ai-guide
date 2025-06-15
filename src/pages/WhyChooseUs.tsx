
import GlassNavbar from "@/components/GlassNavbar";
import { BadgeCheck, TrendingUp, Lock, Zap, Info } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    title: "Trusted by Thousands",
    description: "Join professionals worldwide who’ve unlocked career opportunities with ResumeAI.",
    icon: <BadgeCheck className="text-blue-700" size={32} aria-label="Trusted by Thousands" />,
    tooltip: "Over 10,000 successful users — your resume is in good company.",
  },
  {
    title: "Results-Oriented",
    description: "Our users enjoy higher interview rates and quicker job placement.",
    icon: <TrendingUp className="text-green-600" size={32} aria-label="Results-Oriented" />,
    tooltip: "ResumeAI increases your chances of landing interviews.",
  },
  {
    title: "100% Confidential, Always Secure",
    description: "Your documents are encrypted — privacy and data protection are non-negotiable.",
    icon: <Lock className="text-indigo-700" size={32} aria-label="Confidential and Secure" />,
    tooltip: "We never share your data. Everything is stored securely.",
  },
  {
    title: "Lightning-Fast, Hassle-Free",
    description: "AI-powered optimizations delivered in seconds. No manual edits, no stress.",
    icon: <Zap className="text-yellow-500" size={32} aria-label="Lightning Fast" />,
    tooltip: "Instant resume feedback and optimization, 24/7.",
  },
];

const WhyChooseUs = () => (
  <div className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-indigo-100">
    <GlassNavbar />
    <main className="pt-28 pb-10 max-w-5xl mx-auto px-4 flex flex-col items-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-center mb-4 text-gray-900">
        Why Choose <span className="text-blue-700">ResumeAI</span>?
      </h1>
      <p className="text-lg sm:text-xl text-center text-gray-700 max-w-2xl mb-8">
        Unlock your career potential with a platform trusted by thousands. ResumeAI is designed for job seekers who want results, privacy, and speed — all backed by real expertise and world-class security.
      </p>
      <section className="grid gap-6 sm:grid-cols-2 mt-2 w-full">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="bg-white/70 shadow-lg rounded-xl p-5 flex gap-4 items-start hover:shadow-xl transition"
          >
            <div className="shrink-0 mt-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0}>{feature.icon}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="flex items-center gap-1 text-sm">
                      <Info className="w-3 h-3 text-muted-foreground" />
                      {feature.tooltip}
                    </span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-gray-700 text-base">{feature.description}</p>
            </div>
          </div>
        ))}
      </section>
      <div className="mt-12">
        <Button size="lg" className="text-xl font-semibold px-8 py-5 shadow-xl bg-blue-700 hover:bg-blue-800 transition">
          Ready to stand out? Try ResumeAI today!
        </Button>
      </div>
    </main>
  </div>
);

export default WhyChooseUs;
