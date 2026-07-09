import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Heart, Send, Sparkles, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-12 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white/80 via-blue-50/30 to-lime-50/20 dark:from-slate-950/80 dark:via-slate-900/60 dark:to-blue-950/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div>
            <Logo size="md" showText animate={false} />
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Helping curious kids aged 7–12 build rich vocabularies through
              playful, AI-powered daily lessons.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Quick Links
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <Link to="/grade-view/k-12" className="hover:text-blue-600 transition-colors">
                    K-12 Curriculum
                  </Link>
                </li>
                <li>
                  <Link to="/cosmokid" className="hover:text-blue-600 transition-colors">
                    CosmoKid
                  </Link>
                </li>
                {/* <li>
                  <Link to="/origami" className="hover:text-blue-600 transition-colors">
                    origami
                  </Link>
                  
                </li> */}
                 <li>
                     <Link to="/ai" className="hover:text-blue-600 transition-colors">
                    AI Tutor
                  </Link>
                   </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Support
              </h4>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>
                  <Link to="/privacy" className="hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-blue-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/faqzaheen" className="hover:text-blue-600 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social */}
          <div className="md:text-right">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Stay connected
            </h4>
            <div className="flex md:justify-end gap-2">
              {[Send, Sparkles, Globe].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:scale-110 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Zaheen Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 fill-red-400 text-red-400" />{" "}
            for young learners everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}