
import GlassNavbar from "@/components/GlassNavbar";
import { Check, FileCheck, Search, Zap } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    title: "AI-Powered Resume Review",
    description: "Let advanced AI scan your resume for clarity, structure, and persuasive impact—so you stand out, every time.",
    icon: <FileCheck className="text-blue-700" aria-label="AI Resume Analysis" size={28} />,
    tooltip: "Get insights usually reserved for top career coaches.",
  },
  {
    title: "ATS-Ready Formatting",
    description: "Optimize your resume to breeze past Applicant Tracking Systems and reach real human recruiters.",
    icon: <Check className="text-green-600" aria-label="ATS Optimization" size={28} />,
    tooltip: "Many resumes are missed due to formatting—ResumeAI fixes that automatically.",
  },
  {
    title: "Effortless Keyword Match",
    description: "Automatically identify and add missing keywords based on your target job description to boost relevance.",
    icon: <Search className="text-fuchsia-700" aria-label="Keyword Matching" size={28} />,
    tooltip: "Beat the bots with tailor-made content for every role.",
  },
  {
    title: "Instant One-Click Enhancement",
    description: "Generate a ready-to-submit resume—no templates, no effort, just results. Perfect for tight deadlines.",
    icon: <Zap className="text-yellow-500" aria-label="One-Click Optimization" size={28} />,
    tooltip: "Go from upload to optimized in seconds.",
  },
];

function FeatureCard({ feature }: { feature: typeof FEATURES[0] }) {
  return (
    <div className="bg-white/80 shadow-xl rounded-xl p-5 flex items-start gap-4 transition hover:scale-[1.025] hover:shadow-2xl min-h-[128px] group">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="mt-1">{feature.icon}</span>
          </TooltipTrigger>
          <TooltipContent>
            <span className="flex items-center gap-1 text-sm text-gray-600">
              <Check className="w-4 h-4 text-muted-foreground" />
              {feature.tooltip}
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div>
        <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-blue-800 transition">{feature.title}</h3>
        <p className="text-gray-700 text-base">{feature.description}</p>
      </div>
    </div>
  );
}

const Features = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <GlassNavbar />
    <div className="pt-28 max-w-3xl mx-auto px-4">
      {/* Trust bar */}
      <div className="flex flex-wrap items-center justify-center mb-6 gap-2">
        <Check className="text-green-600 w-5 h-5" />
        <span className="text-md font-medium text-gray-800">
          Trusted by job seekers at Google, Amazon, & Fortune 500s <span className="text-green-600 font-semibold">*</span>
        </span>
      </div>
      {/* Main heading */}
      <h1 className="text-4xl font-bold text-center mb-2 text-gray-900 leading-tight">
        Unlock Your Career with <span className="text-blue-700">ResumeAI</span>
      </h1>
      <p className="text-center text-lg text-gray-700 mb-12 max-w-xl mx-auto">
        Get expert AI guidance, instant optimizations, and the confidence to apply for your dream roles.
      </p>
      {/* Features grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 mb-10">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
      {/* Fine print microcopy */}
      <p className="text-center text-xs text-gray-500 mb-10">
        <span className="font-medium text-blue-700">*</span> ResumeAI delivers private, secure, and confidential feedback—your documents are never shared.
      </p>
      {/* CTA Button */}
      <div className="flex justify-center mb-4">
        <Button
          size="lg"
          className="text-lg font-semibold px-8 py-5 shadow-xl bg-blue-700 hover:bg-blue-800 transition hover:scale-105 animate-fade-in"
        >
          Ready to stand out? Try ResumeAI today!
        </Button>
      </div>
    </div>
  </div>
);

export default Features;
