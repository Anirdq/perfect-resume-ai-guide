
import { FileText, Star, Zap } from "lucide-react";

export const HowItWorks = () => (
  <section className="px-4 py-12 max-w-4xl mx-auto animate-fade-in">
    <h2 className="text-2xl font-extrabold text-gray-900 mb-7 text-center">How It Works</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="flex flex-col items-center text-center gap-3 transition-all hover:scale-105">
        <span className="rounded-xl bg-blue-100 p-4 mb-1">
          <FileText className="h-8 w-8 text-blue-500" />
        </span>
        <span className="font-semibold text-blue-700 text-lg">Upload Resume</span>
        <span className="text-gray-600">Import your resume via file, copy/paste, or image.</span>
      </div>
      <div className="flex flex-col items-center text-center gap-3 transition-all hover:scale-105">
        <span className="rounded-xl bg-yellow-100 p-4 mb-1">
          <Star className="h-8 w-8 text-yellow-500" />
        </span>
        <span className="font-semibold text-yellow-700 text-lg">AI Analysis</span>
        <span className="text-gray-600">AI scans for relevance, skills, and quick wins.</span>
      </div>
      <div className="flex flex-col items-center text-center gap-3 transition-all hover:scale-105">
        <span className="rounded-xl bg-blue-100 p-4 mb-1">
          <Zap className="h-8 w-8 text-blue-700" />
        </span>
        <span className="font-semibold text-blue-700 text-lg">Optimize & Download</span>
        <span className="text-gray-600">Review, edit, and export your upgraded resume instantly.</span>
      </div>
    </div>
  </section>
);
