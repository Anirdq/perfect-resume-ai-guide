
import { Zap, Users, Star, FileText } from "lucide-react";

export const HomeFooter = () => (
  <footer className="bg-slate-900 text-white py-16 px-4">
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 justify-between">
      <div className="mb-8 lg:mb-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-slate-700 to-slate-600 p-2 rounded-lg">
            <Zap className="text-white h-6 w-6" />
          </div>
          <span className="font-semibold text-2xl tracking-tight">Nexus</span>
        </div>
        <div className="text-slate-400 text-base mb-4 max-w-sm">
          Intelligent resume optimization platform trusted by professionals worldwide.
        </div>
        <div className="flex gap-4">
          <a href="https://twitter.com/" aria-label="Twitter" target="_blank" rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors p-2 rounded-lg hover:bg-slate-800">
            <Star className="h-5 w-5" />
          </a>
          <a href="https://linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"
            className="hover:text-slate-300 transition-colors p-2 rounded-lg hover:bg-slate-800">
            <Users className="h-5 w-5" />
          </a>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-4 text-lg">Support</h4>
        <ul className="text-slate-400 space-y-3 text-base">
          <li className="hover:text-white cursor-pointer transition-colors">How it works</li>
          <li className="hover:text-white cursor-pointer transition-colors">Privacy & Security</li>
          <li className="hover:text-white cursor-pointer transition-colors">Success Stories</li>
          <li className="hover:text-white cursor-pointer transition-colors">Integration Guide</li>
        </ul>
      </div>
      
      <div>
        <h4 className="font-semibold mb-4 text-lg">Contact</h4>
        <ul className="text-slate-400 space-y-3 text-base">
          <li>
            Email: <a href="mailto:hello@nexus.app" className="underline hover:text-white transition-colors">
              hello@nexus.app
            </a>
          </li>
          <li>Support: Available 24/7</li>
        </ul>
      </div>
    </div>
    
    <div className="text-center text-slate-500 mt-12 pt-8 border-t border-slate-800 text-sm">
      &copy; {new Date().getFullYear()} Nexus. Crafted for professionals.
    </div>
  </footer>
);
