
import GlassNavbar from "@/components/GlassNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { SocialProof } from "@/components/home/SocialProof";
import { DemoAnimation } from "@/components/home/DemoAnimation";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeatureCards } from "@/components/home/FeatureCards";
import { PricingPreview } from "@/components/home/PricingPreview";
import { HomeFooter } from "@/components/home/HomeFooter";

const Home = () => (
  <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col">
    <GlassNavbar />
    <main className="flex-1 w-full flex flex-col gap-20">
      <HeroSection />
      <SocialProof />
      <DemoAnimation />
      <HowItWorks />
      <FeatureCards />
      <PricingPreview />
    </main>
    <HomeFooter />
  </div>
);

export default Home;
