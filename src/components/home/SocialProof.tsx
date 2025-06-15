
import { Star, Users, Check } from "lucide-react";

export const SocialProof = () => (
  <section className="w-full flex flex-col items-center py-8 px-2 gap-6 bg-white/50 rounded-xl shadow mt-2">
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 mb-2 w-full">
      <div className="flex items-center justify-center gap-2">
        <Star className="text-yellow-400 h-6 w-6" />
        <span className="font-bold text-xl text-gray-900">4.9/5</span>
        <span className="text-gray-600 text-base">stars from 2,700+ users</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="text-blue-600 h-6 w-6" />
        <span className="font-bold text-xl text-gray-900">12,000+</span>
        <span className="text-gray-600 text-base">Resumes optimized</span>
      </div>
      <div className="flex items-center gap-2">
        <Check className="text-green-500 h-6 w-6" />
        <span className="text-gray-700 font-semibold text-base">Trusted by job seekers worldwide</span>
      </div>
    </div>
    <div className="flex flex-col md:flex-row justify-center gap-4">
      {/* Example logos, styled to match HeroSection with no borders */}
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6e/Indeed_logo.png" className="h-7 object-contain grayscale opacity-80 hover:opacity-100 transition-all" alt="Indeed" />
      <img src="https://upload.wikimedia.org/wikipedia/commons/8/85/LinkedIn_Logo.svg" className="h-7 object-contain grayscale opacity-80 hover:opacity-100 transition-all" alt="LinkedIn" />
      <img src="https://upload.wikimedia.org/wikipedia/commons/7/75/Glassdoor_Logo_2014.png" className="h-7 object-contain grayscale opacity-80 hover:opacity-100 transition-all" alt="Glassdoor" />
      <img src="https://upload.wikimedia.org/wikipedia/commons/0/0e/Monster.com_logo.svg" className="h-7 object-contain grayscale opacity-80 hover:opacity-100 transition-all" alt="Monster" />
    </div>
  </section>
);
