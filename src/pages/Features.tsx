
import GlassNavbar from "@/components/GlassNavbar";

const Features = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <GlassNavbar />
    <div className="pt-28 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">Features</h1>
      <ul className="space-y-8">
        <li>
          <h3 className="text-xl font-bold text-blue-700 mb-2">AI Resume Analysis</h3>
          <p className="text-gray-700">
            Advanced AI evaluates your resume for clarity, structure, and impact, providing actionable feedback in seconds.
          </p>
        </li>
        <li>
          <h3 className="text-xl font-bold text-blue-700 mb-2">ATS Optimization</h3>
          <p className="text-gray-700">
            Guaranteed to improve the chances of passing Applicant Tracking Systems by identifying key improvements.
          </p>
        </li>
        <li>
          <h3 className="text-xl font-bold text-blue-700 mb-2">Keyword Matching</h3>
          <p className="text-gray-700">
            Pinpoints missing keywords based on your job description to help you tailor your resume for each role.
          </p>
        </li>
        <li>
          <h3 className="text-xl font-bold text-blue-700 mb-2">One-Click Optimization</h3>
          <p className="text-gray-700">
            Instantly generate an optimized version of your resume ready to submit—no templates or formatting headaches!
          </p>
        </li>
      </ul>
    </div>
  </div>
);

export default Features;
