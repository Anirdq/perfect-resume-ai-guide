import { Star, Users, Check } from "lucide-react";

// Utility function for Wikimedia FilePath; keep code in SocialProof for now because it's used only here
function getWikimediaFilePath(url: string): string {
  try {
    const u = new URL(url);
    if (
      (u.hostname.includes("wikimedia.org") || u.hostname.includes("wikipedia.org")) &&
      u.pathname.match(/\.(svg|png)$/)
    ) {
      const parts = u.pathname.split("/");
      const fileName = parts[parts.length - 1];
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${fileName}`;
    }
  } catch {}
  return url;
}

// Social proof company logos: updated with Google and Amazon
const socialProofLogos = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/f/fc/Indeed_logo.svg",
    alt: "Indeed",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/8/85/LinkedIn_Logo.svg",
    alt: "LinkedIn",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    alt: "Google",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    alt: "Amazon",
  },
];

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
      {socialProofLogos.map(({ src, alt }) => (
        <img
          key={alt}
          src={getWikimediaFilePath(src)}
          alt={alt}
          className="h-7 object-contain grayscale opacity-80 hover:opacity-100 transition-all"
          style={{ background: "transparent" }}
          loading="lazy"
          draggable={false}
        />
      ))}
    </div>
  </section>
);
