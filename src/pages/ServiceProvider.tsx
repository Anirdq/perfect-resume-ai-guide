
import GlassNavbar from "@/components/GlassNavbar";

const ServiceProvider = () => (
  <div className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-indigo-100">
    <GlassNavbar />
    <div className="pt-28 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Why Choose ResumeAI as Your Career Partner?
      </h1>
      <div className="space-y-8 text-lg">
        <div>
          <h3 className="text-2xl font-bold text-blue-700 mb-2">Trusted by Thousands</h3>
          <p className="text-gray-700">
            Candidates and professionals around the world use ResumeAI to unlock more interview opportunities and land their dream roles.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-700 mb-2">Results-Oriented</h3>
          <p className="text-gray-700">
            Data shows ResumeAI-users score higher on resume screening and get noticed by top-tier employers, fast.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-700 mb-2">100% Confidential, Always Secure</h3>
          <p className="text-gray-700">
            Your documents are encrypted and never shared. Your privacy and data security are our top priorities.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-700 mb-2">Lightning-Fast, Hassle-Free</h3>
          <p className="text-gray-700">
            Our AI delivers optimizations in seconds—no more manual edits or waiting for feedback.
          </p>
        </div>
      </div>
      <div className="mt-12 text-center">
        <span className="inline-block font-semibold text-xl text-blue-700 px-8 py-4 bg-white/60 rounded-xl shadow-lg backdrop-blur-md">
          Ready to stand out? Try ResumeAI today!
        </span>
      </div>
    </div>
  </div>
);

export default ServiceProvider;
