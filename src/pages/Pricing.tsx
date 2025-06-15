
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/BrandLogo';
import { Sparkles, Zap } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    description: "Get started with AI-powered resume optimization.",
    price: "Free",
    features: [
      "Unlimited Resume Uploads",
      "Basic AI Analysis",
      "1 Resume Save",
      "Community Support"
    ],
    highlight: false,
  },
  {
    name: "Pro",
    description: "The ultimate package for job seekers and professionals.",
    price: "$19",
    priceSuffix: "/mo",
    features: [
      "Unlimited Resume Uploads",
      "Advanced AI Optimization",
      "Multiple Resume Versions",
      "Job Description Matching",
      "Priority Email Support"
    ],
    highlight: true,
  },
  {
    name: "Expert",
    description: "For recruiters, agencies, and power users.",
    price: "$59",
    priceSuffix: "/mo",
    features: [
      "Everything in Pro",
      "Team Resume Management",
      "API Access",
      "Bulk Analysis",
      "Dedicated Support"
    ],
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-100 via-fuchsia-100 via-60% to-blue-50 font-sans relative overflow-x-hidden">
      {/* Overlays */}
      <div className="blend-overlay-cyan"></div>
      <div className="blend-overlay-violet"></div>
      <div className="blend-future-lines"></div>
      {/* PRICING HERO */}
      <section className="max-w-4xl mx-auto pt-28 pb-8 text-center relative z-10">
        <BrandLogo size={48}/>
        <h1 className="mt-6 text-5xl md:text-7xl font-black text-glow leading-tight tracking-tighter">
          Simple transparent pricing.<br />
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-400 bg-clip-text text-transparent">Pay only for what you use.</span>
        </h1>
        <p className="mt-10 text-xl md:text-2xl text-gray-800/80 max-w-2xl mx-auto font-normal">
          Upgrade to unlock all AI-powered resume features and maximize your chances to land your dream job.
        </p>
      </section>

      {/* PRICING CARDS */}
      <section className="w-full flex flex-col items-center z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto pb-14">
          {plans.map((plan, idx) => (
            <Card key={plan.name}
              className={`card-glass card-gradient-border relative px-8 pt-8 pb-14 rounded-2xl flex flex-col items-center text-center transition-transform duration-300
                ${plan.highlight ? 'pricing-pop scale-105 shadow-2xl border-blue-300 z-20' : 'hover:scale-105'}
              `}
              style={{ minHeight: 440 }}
            >
              {plan.highlight && (
                <Badge className="bg-gradient-to-r from-cyan-400 to-fuchsia-300 absolute -top-7 left-1/2 -translate-x-1/2 text-lg px-6 py-2 font-bold rounded-xl shadow-xl border-0 animate-pulse"><Zap className="inline mr-1 -mt-1" />Best Value</Badge>
              )}
              <h2 className="text-3xl font-black mt-3 text-cyan-700">{plan.name}</h2>
              <p className="text-gray-500 mt-3 text-base min-h-12">{plan.description}</p>
              <div className="text-5xl font-extrabold my-6 text-blue-900">
                {plan.price}
                {plan.priceSuffix && <span className="text-2xl font-thin text-blue-400">{plan.priceSuffix}</span>}
              </div>
              <ul className="text-left text-lg mb-6 mt-3 space-y-2 text-blue-800/90 font-medium min-h-36">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button className="cta-glow px-8 py-3 rounded-full font-bold w-full mt-auto">
                {plan.price === "Free" ? "Get Started" : "Upgrade"}
              </Button>
            </Card>
          ))}
        </div>
      </section>
      <footer className="w-full py-10 mt-8 border-t">
        <div className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
