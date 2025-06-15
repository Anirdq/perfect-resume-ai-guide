
import GlassNavbar from "@/components/GlassNavbar";
import { HeroSection } from "@/components/home/HeroSection";
import { SocialProof } from "@/components/home/SocialProof";
import { DemoAnimation } from "@/components/home/DemoAnimation";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeatureCards } from "@/components/home/FeatureCards";
import { PricingPreview } from "@/components/home/PricingPreview";
import { HomeFooter } from "@/components/home/HomeFooter";

const Home = () => (
  <div className="min-h-screen bg-gradient-to-t from-blue-50 via-white to-blue-100 flex flex-col">
    <GlassNavbar />
    <main className="flex-1 w-full flex flex-col gap-16">
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
