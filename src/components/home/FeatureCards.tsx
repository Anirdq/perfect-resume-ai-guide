
import { Zap, FileText, Star } from "lucide-react";

const FEATURES = [
  {
    icon: <Zap className="text-blue-600 h-7 w-7" />,
    title: "AI-Powered Optimization",
    text: "Instantly rewrite and improve your resume with smart, actionable suggestions.",
  },
  {
    icon: <Star className="text-yellow-500 h-7 w-7" />,
    title: "ATS Scan & Score",
    text: "Check your resume's ATS compatibility and boost your ranking.",
  },
  {
    icon: <FileText className="text-blue-600 h-7 w-7" />,
    title: "Live Preview & Editing",
    text: "Edit, preview, and save changes in real time before exporting.",
  }
];

export const FeatureCards = () => (
  <section className="px-4 py-12 max-w-5xl mx-auto animate-fade-in">
    <h2 className="text-2xl font-extrabold text-gray-900 mb-7 text-center">Key Features</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
      {FEATURES.map((f, i) => (
        <div
          className="flex flex-col items-center bg-white/70 shadow rounded-xl p-7 gap-5 hover:shadow-xl transition-all text-center"
          key={i}
        >
          <span className="rounded-full bg-blue-50 p-4">{f.icon}</span>
          <span className="font-semibold text-lg text-gray-900">{f.title}</span>
          <span className="text-gray-600">{f.text}</span>
        </div>
      ))}
    </div>
  </section>
)
