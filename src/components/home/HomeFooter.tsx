
import { Star, Users, Zap, FileText } from "lucide-react";

export const HomeFooter = () => (
  <footer className="bg-gray-950 text-white py-12 px-4">
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 justify-between">
      <div className="mb-8 lg:mb-0">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="text-yellow-400 h-6 w-6" />
          <span className="font-bold text-xl">ResumeAI</span>
        </div>
        <div className="text-gray-400 text-sm mb-3">AI-powered resume optimization with proven results.</div>
        <div className="flex gap-3">
          <a href="https://twitter.com/" aria-label="Twitter" target="_blank" rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"><Star /></a>
          <a href="https://linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"
            className="hover:text-blue-500 transition-colors"><Users /></a>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-2">FAQs</h4>
        <ul className="text-gray-400 space-y-1 text-sm">
          <li>Is ResumeAI really free to try?</li>
          <li>How does the AI scoring work?</li>
          <li>Is my data secure?</li>
          <li>How fast is the optimization?</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-2">Contact</h4>
        <ul className="text-gray-400 space-y-1 text-sm">
          <li>Email: <a href="mailto:support@resumeai.app" className="underline hover:text-blue-400">support@resumeai.app</a></li>
          <li>Live chat: Mon–Fri, 9am–6pm</li>
        </ul>
      </div>
    </div>
    <div className="text-center text-gray-500 mt-10 text-xs">
      &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
    </div>
  </footer>
)
