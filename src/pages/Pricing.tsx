import GlassNavbar from "@/components/GlassNavbar";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Features to compare
const FEATURES = [{
  label: "Resume Analyses",
  basic: "1",
  pro: "Unlimited",
  icon: "📝"
}, {
  label: "AI Optimization",
  basic: "Essential",
  pro: "Advanced AI & ATS",
  icon: "🤖"
}, {
  label: "Keyword Matching",
  basic: "No",
  pro: "Yes",
  icon: "🔍"
}, {
  label: "Priority Support",
  basic: "Email Only",
  pro: "Email & Chat",
  icon: "⚡"
}, {
  label: "Secure Upload/Download",
  basic: "Yes",
  pro: "Yes",
  icon: "🔒"
}, {
  label: "New Features & Updates",
  basic: "—",
  pro: "Included",
  icon: "🚀"
}];
export default function Pricing() {
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-10">
      <GlassNavbar />
      <div className="pt-28 max-w-4xl mx-auto px-4">
        {/* Section heading and subheading */}
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">Choose Your Plan</h1>
        <p className="text-center text-lg text-gray-700 mb-10 my-[55px]">
          Land interviews faster with smart, flexible pricing. Start for free — upgrade anytime.
        </p>

        {/* Pricing tiers */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
          {/* Basic Card */}
          <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-md w-full md:w-1/2 border border-blue-100 flex flex-col relative">
            <h2 className="text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2">
              Basic <span className="text-base font-medium bg-blue-100 text-blue-700 px-2 rounded-full">Free</span>
            </h2>
            <p className="text-gray-700 mb-5">Get started with AI insights at no cost.</p>
            <span className="text-3xl font-bold text-gray-900">$0</span>
            <ul className="mt-6 text-gray-600 space-y-2 text-left text-base mb-6">
              <li>📝 1 Resume analysis</li>
              <li>🤖 Essential AI optimization</li>
              <li>🔒 Secure upload/download</li>
              <li>📧 Email support</li>
            </ul>
            <Button size="lg" className="mt-auto bg-blue-700 hover:bg-blue-800 text-white font-semibold w-full transition">
              Get Started Free
            </Button>
            <span className="block text-xs font-medium text-center text-gray-400 mt-3">
              No credit card required
            </span>
          </div>

          {/* Pro Card */}
          <div className="bg-white/90 ring-2 ring-indigo-400 p-8 rounded-2xl shadow-xl w-full md:w-1/2 border border-indigo-100 flex flex-col relative z-10 scale-105 md:-mt-4">
            {/* Most popular badge */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-700 text-white font-semibold px-4 py-1 rounded-full shadow-md flex items-center text-sm">
              <Star className="inline-block w-4 h-4 mr-1 -mt-0.5" /> Most Popular
            </div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-2 flex items-center">Pro</h2>
            <p className="text-gray-700 mb-4">Unlock unlimited AI power and advanced tools for job-winning resumes.</p>
            <span className="text-3xl font-bold text-indigo-900">
              $12
              <span className="text-xl font-medium text-gray-700">/mo</span>
            </span>
            <span className="block text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded mt-1 mb-4 w-fit">
              Save 20% — $115/year, billed yearly
            </span>
            <ul className="mt-3 text-gray-700 space-y-2 text-left text-base mb-6">
              <li>✅ Unlimited resume optimizations</li>
              <li>🤖 Advanced keyword & ATS match</li>
              <li>⚡ Priority support (email & chat)</li>
              <li>🚀 All future AI upgrades</li>
            </ul>
            <Button size="lg" className="mt-auto bg-indigo-700 hover:bg-indigo-800 text-white font-semibold w-full transition shadow-lg">
              Upgrade to Pro
            </Button>
            <span className="block text-xs font-medium text-center text-gray-400 mt-3">
              Cancel anytime. Risk-free.
            </span>
          </div>
        </div>

        {/* Feature comparison table */}
        <div className="mx-auto max-w-3xl mt-12 overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="">
                <th className="text-left text-base text-gray-700 pb-3">Features</th>
                <th className="text-center text-blue-800 font-semibold pb-3">Basic</th>
                <th className="text-center text-indigo-800 font-semibold pb-3">Pro</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map(f => <tr key={f.label} className="bg-white/60 hover:bg-indigo-50 rounded-lg">
                  <td className="py-2 px-1 font-medium flex items-center gap-2 text-gray-900 text-base">
                    <span className="text-lg">{f.icon}</span> {f.label}
                  </td>
                  <td className="text-center text-gray-700 font-normal">{f.basic || <span className="opacity-40">—</span>}</td>
                  <td className="text-center text-gray-900 font-semibold">{f.pro || <span className="opacity-40">—</span>}</td>
                </tr>)}
            </tbody>
          </table>
        </div>

        {/* Guarantee bar */}
        <div className="mt-12 text-center">
          <span className="inline-block font-semibold text-base text-indigo-700 px-8 py-3 bg-white/60 rounded-xl shadow-md backdrop-blur-md">
            100% satisfaction guarantee · Cancel or downgrade anytime
          </span>
        </div>
      </div>
    </div>;
}