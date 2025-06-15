
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/BrandLogo';

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
    description: "The preferred package for most professionals.",
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-100 via-fuchsia-100 via-50% to-blue-50 font-poppins relative overflow-x-hidden">
      {/* Overlays */}
      <div className="blend-future-overlay"></div>
      <div className="blend-cyan-vl"></div>
      <div className="blend-violet-vl"></div>
      {/* PRICING HERO */}
      <section className="max-w-4xl mx-auto pt-28 pb-8 text-center relative z-10">
        <BrandLogo size={50}/>
        <h1 className="mt-6 mb-4 hero-glow leading-tight tracking-tight">
          Simple transparent pricing.<br />
          <span className="text-[2.25rem] md:text-5xl block font-poppins" style={{background: "linear-gradient(90deg,#50eaff 25%,#a68efd 60%,#54eeff 95%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Pay only for what you use.</span>
        </h1>
        <p className="mt-8 text-xl md:text-2xl text-blue-700/70 max-w-2xl mx-auto font-normal hero-subtle">
          Upgrade to unlock all AI-powered resume features and maximize your chances to land your dream job.
        </p>
      </section>
      {/* PRICING CARDS */}
      <section className="w-full flex flex-col items-center z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto pb-14">
          {plans.map((plan, idx) => (
            <Card key={plan.name}
              className={`card-futuristic card-gradient-border relative px-8 pt-8 pb-14 rounded-3xl flex flex-col items-center text-center transition-transform duration-300
                ${plan.highlight ? 'scale-105 shadow-2xl border-blue-500 z-20' : 'hover:scale-105'}
              `}
              style={{ minHeight: 440 }}
            >
              {plan.highlight && (
                <Badge className="bg-gradient-to-r from-cyan-500 to-fuchsia-400 absolute -top-7 left-1/2 -translate-x-1/2 text-lg px-8 py-2 font-bold rounded-full shadow-lg border-0 animate-pulse ring-2 ring-blue-400/10">
                  Most Popular
                </Badge>
              )}
              <h2 className="text-3xl font-black mt-3 text-blue-800 font-futuristic">{plan.name}</h2>
              <p className="text-blue-700/70 mt-3 text-base min-h-12">{plan.description}</p>
              <div className="text-5xl font-extrabold my-6 text-cyan-700">
                {plan.price}
                {plan.priceSuffix && <span className="text-2xl font-thin text-blue-400">{plan.priceSuffix}</span>}
              </div>
              <ul className="text-left text-lg mb-6 mt-3 space-y-2 text-blue-900 font-medium min-h-36">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2">
                    <span className="inline-block bg-cyan-200 w-2 h-2 rounded-full"></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button className="cta-glow px-8 py-3 rounded-full font-bold w-full mt-auto text-lg shadow">
                {plan.price === "Free" ? "Get Started" : "Upgrade"}
              </Button>
            </Card>
          ))}
        </div>
      </section>
      <footer className="w-full py-10 mt-8 border-t">
        <div className="text-center text-blue-700/60 text-[0.98rem] font-normal">
          &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
