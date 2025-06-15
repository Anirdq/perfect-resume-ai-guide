
import { Zap, Check, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import React from "react";

// Underrated MNCs with verified transparent SVG logos
const companyLogos = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/68/Capgemini_201x_logo.svg",
    alt: "Capgemini"
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Siemens_logo.svg",
    alt: "Siemens"
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Bosch-logo.svg",
    alt: "Bosch"
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Wipro_Primary_Logo_Color_RGB.svg",
    alt: "Wipro"
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/7/77/Philips_logo.svg",
    alt: "Philips"
  },
];

// Utility: use Wikimedia's "Special:FilePath" for SVGs from Wikimedia/Wikipedia, else original URL
function getWikimediaFilePath(url: string): string | null {
  // Only handle Wikimedia SVGs here
  try {
    const u = new URL(url);
    if (
      (u.hostname.includes("wikimedia.org") || u.hostname.includes("wikipedia.org")) &&
      u.pathname.endsWith(".svg")
    ) {
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

const LogoImage = ({ src, alt }: { src: string; alt: string }) => {
  const [imgSrc, setImgSrc] = React.useState(getProxiedUrl(src));
  const [attemptedFallback, setAttemptedFallback] = React.useState(false);

  React.useEffect(() => {
    // Log current image loading path for diagnostics
    console.log(`[LogoImage] loading:`, imgSrc, "(original:", src, ")");
  }, [imgSrc, src]);

  const handleError = () => {
    if (!attemptedFallback) {
      // Try switching to original src as a backup if proxy/special path fails
      setImgSrc(src);
      setAttemptedFallback(true);
    } else {
      // If both fail, log and hide
      console.log("[LogoImage] Failed to load logo:", alt, src);
      setImgSrc(""); // causes React to hide the image
    }
  };

  if (!imgSrc) return null;

  return (
    <img
      src={imgSrc}
      alt=""
      className="h-7 md:h-9 object-contain rounded transition-all grayscale opacity-80 hover:opacity-100"
      style={{ minWidth: 80, maxWidth: 120, background: "transparent" }}
      loading="lazy"
      onError={handleError}
      draggable={false}
      aria-hidden
    />
  );
};

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-col items-center w-full px-4 pt-20 md:pt-32 pb-16 overflow-hidden bg-white/70 animate-fade-in">
      <div className="inline-block animate-scale-in shadow-xl rounded-3xl p-2 mb-6 bg-white/90">
        <Zap className="text-blue-600 h-8 w-8" aria-label="AI Lightning bolt" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-br from-blue-700 to-blue-400 bg-clip-text text-transparent mb-4 text-center max-w-3xl">
        Land More Interviews with AI-Optimized Resumes
      </h1>
      <p className="text-lg md:text-xl text-gray-700 font-medium mb-8 max-w-2xl mx-auto text-center">
        ResumeAI instantly analyzes and optimizes your resume — boosting your chances to get noticed by top employers.
      </p>
      <Button
        size="lg"
        className="text-lg md:text-xl font-semibold px-8 md:px-10 py-4 md:py-6 bg-blue-700 hover:bg-blue-800 shadow-2xl transition-all duration-300 mb-5"
        onClick={() => navigate("/resume")}
        aria-label="Upload Resume"
      >
        Upload Resume
      </Button>
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center mt-8 mb-3">
        <span className="text-xs md:text-sm uppercase tracking-widest text-gray-400 font-semibold mb-2">
          Trusted by job seekers from companies like
        </span>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 w-full">
          {companyLogos.map(({ src, alt }) => (
            <LogoImage key={alt} src={src} alt={alt} />
          ))}
        </div>
      </div>
      <div className="flex flex-row justify-center gap-3 items-center text-gray-500 mt-6 text-base animate-fade-in">
        <Check className="h-5 w-5 text-green-600 animate-bounce" aria-label="Checkmark" />
        <span>Fast. Secure. Free to start.</span>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:block">
        <ArrowDown className="h-7 w-7 text-blue-400 animate-bounce" />
      </div>
    </section>
  );
};
