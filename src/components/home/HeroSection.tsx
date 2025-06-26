import { Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React from "react";

// Premium company logos with verified transparent SVG logos
const companyLogos = [{
  src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  alt: "Google"
}, {
  src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  alt: "Microsoft"
}, {
  src: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  alt: "IBM"
}, {
  src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  alt: "Amazon"
}, {
  src: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg",
  alt: "Intel"
}];

// Utility: use Wikimedia's "Special:FilePath" for SVGs from Wikimedia/Wikipedia, else original URL
function getWikimediaFilePath(url: string): string | null {
  // Only handle Wikimedia SVGs here
  try {
    const u = new URL(url);
    if ((u.hostname.includes("wikimedia.org") || u.hostname.includes("wikipedia.org")) && u.pathname.endsWith(".svg")) {
      // Wikimedia images: extract the filename from path, use in the FilePath API
      // e.g. /wikipedia/commons/7/77/Philips_logo.svg -> Philips_logo.svg
      const parts = u.pathname.split("/");
      const fileName = parts[parts.length - 1];
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${fileName}`;
    }
  } catch (e) {
    return null;
  }
  return null;
}
function getProxiedUrl(url: string): string {
  // Try filepath first, else fallback to original url
  return getWikimediaFilePath(url) ?? url;
}
const LogoImage = ({
  src,
  alt
}: {
  src: string;
  alt: string;
}) => {
  const [imgSrc, setImgSrc] = React.useState(getProxiedUrl(src));
  const [attemptedFallback, setAttemptedFallback] = React.useState(false);

  React.useEffect(() => {
    console.log(`[LogoImage] loading:`, imgSrc, "(original:", src, ")");
  }, [imgSrc, src]);

  const handleError = () => {
    if (!attemptedFallback) {
      setImgSrc(src);
      setAttemptedFallback(true);
    } else {
      console.log("[LogoImage] Failed to load logo:", alt, src);
      setImgSrc("");
    }
  };

  if (!imgSrc) return null;

  return <img 
    src={imgSrc} 
    alt="" 
    className="h-8 md:h-10 object-contain rounded transition-all grayscale opacity-60 hover:opacity-80" 
    style={{
      minWidth: 100,
      maxWidth: 140,
      background: "transparent"
    }} 
    loading="lazy" 
    onError={handleError} 
    draggable={false} 
    aria-hidden 
  />;
};

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative flex flex-col items-center w-full px-4 pt-24 md:pt-32 pb-20 overflow-hidden bg-white">
      <div className="inline-block animate-scale-in shadow-lg rounded-2xl p-3 mb-8 bg-gradient-to-br from-slate-900 to-slate-700">
        <Zap className="text-white h-8 w-8" aria-label="AI Lightning bolt" />
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent mb-6 text-center max-w-4xl leading-tight">
        Intelligent Resume Optimization
      </h1>
      
      <p className="text-xl md:text-2xl text-slate-600 font-light mb-10 max-w-2xl mx-auto text-center leading-relaxed">
        Transform your career with AI-powered resume analysis that gets you noticed by top employers.
      </p>
      
      <Button 
        size="lg" 
        className="text-lg md:text-xl font-medium px-10 md:px-12 py-6 md:py-7 bg-slate-900 hover:bg-slate-800 shadow-xl transition-all duration-300 mb-8 rounded-lg" 
        onClick={() => navigate("/resume")} 
        aria-label="Start Optimization"
      >
        Start Optimization
      </Button>
      
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center mt-12 mb-6">
        <span className="text-sm uppercase tracking-widest text-slate-400 font-medium mb-4">
          Trusted by professionals at
        </span>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 w-full">
          {companyLogos.map(({src, alt}) => 
            <LogoImage key={alt} src={src} alt={alt} />
          )}
        </div>
      </div>
      
      <div className="flex flex-row justify-center gap-3 items-center text-slate-500 mt-8 text-lg">
        <Check className="h-5 w-5 text-emerald-600" aria-label="Checkmark" />
        <span>Secure. Professional. Results-driven.</span>
      </div>
    </section>
  );
};
