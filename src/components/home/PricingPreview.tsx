
import { Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const PricingPreview = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-14 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-7 text-center">Choose Your Plan</h2>
      <div className="flex flex-col md:flex-row justify-center gap-10">
        <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl flex-1 max-w-md flex flex-col items-center transition-all border-2 border-gray-200">
          <div className="flex gap-2 items-center mb-2">
            <Star className="text-blue-500" />
            <span className="text-lg font-bold">Basic</span>
          </div>
          <div className="mb-3 text-3xl font-extrabold text-blue-700">$0</div>
          <ul className="text-gray-600 text-left mb-6 space-y-2 text-sm w-full max-w-xs mx-auto">
            <li>✓ 1 resume analysis</li>
            <li>✓ Core AI optimization</li>
            <li>✓ Secure uploads</li>
            <li>✓ Email support</li>
          </ul>
          <Button
            className="w-full bg-blue-100 text-blue-700 font-semibold hover:bg-blue-50"
            size="lg"
            onClick={() => navigate("/resume")}
          >
            Try for Free
          </Button>
        </div>
        <div className="bg-blue-700 text-white p-8 rounded-2xl shadow-xl flex-1 max-w-md flex flex-col items-center relative border-4 border-blue-600 scale-105">
          <div className="absolute -top-7 right-6 bg-yellow-400 text-yellow-900 rounded-full px-5 py-1 text-xs font-bold shadow">Most Popular</div>
          <div className="flex gap-2 items-center mb-2">
            <Zap className="text-yellow-300" />
            <span className="text-lg font-bold">Pro</span>
          </div>
          <div className="mb-1 text-3xl font-extrabold">$12
            <span className="text-base font-normal text-blue-100">/mo</span>
          </div>
          <div className="text-sm mb-4">or <span className="underline">save 20% billed yearly</span></div>
          <ul className="mb-6 space-y-2 w-full max-w-xs mx-auto text-blue-50 text-left text-sm">
            <li>✓ Unlimited optimizations</li>
            <li>✓ Advanced AI and keyword matching</li>
            <li>✓ Priority support</li>
            <li>✓ All future feature releases</li>
          </ul>
          <Button
            className="w-full bg-yellow-400 text-blue-800 font-semibold hover:bg-yellow-300 transition-all"
            size="lg"
            onClick={() => navigate("/resume")}
          >
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </section>
  );
};
