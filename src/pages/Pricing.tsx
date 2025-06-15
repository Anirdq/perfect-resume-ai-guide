
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/BrandLogo';
import { NeonOverlay } from '@/components/NeonOverlay';

const plans = [
  {
    name: "Starter",
    description: "Try out AI resume optimization risk-free.",
    price: "Free",
    features: [
      "1 AI Resume Save", "Unlimited Uploads", "Basic Analysis", "Community Support"
    ],
    highlight: false,
  },
  {
    name: "Pro",
    description: "Ideal for active job seekers.",
    price: "$19",
    priceSuffix: "/mo",
    features: [
      "Unlimited AI Resumes", "Full Analysis", "Version History", "Match to Jobs", "Priority Email Support"
    ],
    highlight: true,
  },
  {
    name: "Expert",
    description: "Power users, agencies, recruiters.",
    price: "$59",
    priceSuffix: "/mo",
    features: [
      "Everything in Pro", "Team Management", "Bulk Analysis", "Export Designs", "Dedicated AI Coach"
    ],
    highlight: false,
  },
];

const Pricing = () => (
  <div className="relative min-h-screen bg-gradient-to-tr from-[#111327] via-[#241d3c] to-[#321943] font-orbitron text-white">
    <NeonOverlay/>
    <section className="max-w-3xl mx-auto pt-24 pb-4 text-left z-10 px-4">
      <BrandLogo size={44}/>
      <h1 className="mt-6 mb-2 text-5xl md:text-6xl font-orbitron font-bold bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-blue-300 bg-clip-text text-transparent tracking-[.03em] drop-shadow-lg">
        Pricing
      </h1>
      <p className="mt-6 text-lg md:text-2xl text-blue-200 max-w-2xl font-sora">Start free. Go Pro for unlimited AI resume power, or take it to the Expert level for agencies.<br/>Transparent. No hidden fees.</p>
    </section>
    <section className="w-full flex flex-col items-center z-10 relative mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto pb-14 px-3">
        {plans.map((plan, idx) => (
          <Card key={plan.name}
            className={`
              card-futuristic card-gradient-border px-8 pt-10 pb-14 rounded-3xl flex flex-col items-center text-center
              ${plan.highlight ? 'scale-105 shadow-2xl border-cyan-400 z-20 ring-2 ring-fuchsia-400/40' : 'hover:scale-[1.03]'}
              bg-gradient-to-br from-[#191c34] via-[#42278a]/60 to-[#1dd4ee]/10
            `}
            style={{ minHeight: 440 }}
          >
            {plan.highlight && (
              <Badge className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 absolute -top-8 left-1/2 -translate-x-1/2 text-lg px-9 py-2 font-black rounded-full shadow-lg border-0 animate-pulse">Most Popular</Badge>
            )}
            <h2 className="text-3xl font-bold my-2 font-orbitron text-cyan-300 tracking-wide">{plan.name}</h2>
            <p className="text-blue-100/90 mt-3 mb-4 text-lg" style={{minHeight: 62}}>{plan.description}</p>
            <div className="text-5xl font-extrabold my-5 text-fuchsia-200">
              {plan.price}
              {plan.priceSuffix && <span className="text-xl font-thin text-blue-200">{plan.priceSuffix}</span>}
            </div>
            <ul className="text-left text-lg mb-8 mt-2 space-y-3 text-cyan-100 font-medium min-h-36">
              {plan.features.map((f, fi) => (
                <li key={fi} className="flex items-center gap-2">
                  <span className="inline-block bg-gradient-to-tr from-cyan-400 via-fuchsia-400 to-blue-400 w-2 h-2 rounded-full"></span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button className="cta-glow px-8 py-3 rounded-full font-bold w-full mt-auto text-lg shadow">{plan.price === "Free" ? "Get Started" : "Upgrade"}</Button>
          </Card>
        ))}
      </div>
    </section>
    <footer className="w-full py-10 mt-8 border-t border-fuchsia-400/10">
      <div className="text-center text-blue-200/80 text-[1.02rem] font-normal">&copy; {new Date().getFullYear()} ResumeAI. All rights reserved.</div>
    </footer>
  </div>
);

export default Pricing;
