import React from 'react';
import { soundFx } from '../utils/audio';
import { Sparkles, Globe, Heart, Shield, Terminal, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className="relative mt-14 sm:mt-20 border-t border-white/10 bg-[#05070e] text-slate-400 text-xs py-10 sm:py-14 px-3 sm:px-6 lg:px-8 overflow-hidden w-full"
    >
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-cyan-500/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 sm:pb-8 border-b border-white/10">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <span className="text-2xl">⚡</span>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                DataFlow
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v1.0 Hackathon Edition
              </span>
            </div>
            <p className="text-slate-400 max-w-md text-xs sm:text-sm leading-relaxed">
              Making the invisible global movement of internet packets visible, tangible, and understandable for everyone.
            </p>
          </div>

          {/* Hackathon Challenge Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="glass-panel p-3 sm:p-3.5 rounded-2xl border border-cyan-500/20 flex items-center gap-3 w-full sm:w-auto">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                  Hackathon Challenge
                </span>
                <span className="font-display font-bold text-white text-xs sm:text-sm">
                  "Visualizing the Invisible"
                </span>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="p-3 rounded-xl glass-panel text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] min-w-[44px] w-full sm:w-auto"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="font-mono text-xs">Back to Top</span>
            </button>
          </div>
        </div>

        {/* Quick Links & Accessibility Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-xs">
          {/* Column 1: Journey Modules */}
          <div>
            <h4 className="font-mono uppercase tracking-wider text-white font-bold mb-3">
              Simulation Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('simulation')}
                  className="hover:text-cyan-300 transition-colors py-1 text-left cursor-pointer inline-block text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
                >
                  6-Stage Network Pipeline
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('encryption')}
                  className="hover:text-cyan-300 transition-colors py-1 text-left cursor-pointer inline-block text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
                >
                  Cipher Tunnel & Encryption
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('detective')}
                  className="hover:text-cyan-300 transition-colors py-1 text-left cursor-pointer inline-block text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
                >
                  Network Detective Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('worldmap')}
                  className="hover:text-cyan-300 transition-colors py-1 text-left cursor-pointer inline-block text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
                >
                  Subsea Fiber World Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quiz')}
                  className="hover:text-cyan-300 transition-colors py-1 text-left cursor-pointer inline-block text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
                >
                  Interactive Knowledge Quiz
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Tech Concepts */}
          <div>
            <h4 className="font-mono uppercase tracking-wider text-white font-bold mb-3">
              Topics Covered
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li className="py-0.5">Data Packets & MTU Serialization</li>
              <li className="py-0.5">Wi-Fi Radio Waves & NAT Routing</li>
              <li className="py-0.5">BGP & Tier-1 Internet Backbones</li>
              <li className="py-0.5">Fiber Optic Internal Reflection</li>
              <li className="py-0.5">AES-256 / TLS 1.3 Encryption</li>
            </ul>
          </div>

          {/* Column 3: Accessibility */}
          <div>
            <h4 className="font-mono uppercase tracking-wider text-white font-bold mb-3">
              Accessibility & Standards
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Designed with WCAG AA compliance, semantic HTML5, keyboard navigation shortcuts, ARIA labels, and reduced motion responsiveness.
            </p>
          </div>

          {/* Column 4: Architecture */}
          <div>
            <h4 className="font-mono uppercase tracking-wider text-white font-bold mb-3">
              Client Architecture
            </h4>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
              100% Client-side • Zero external telemetry • HTML5 Canvas & Web Audio API • React 19 & Tailwind CSS.
            </p>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] text-slate-400 font-mono text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} DataFlow. Educational Interactive Project.
          </div>
          <div>
            Crafted for curious minds and students worldwide.
          </div>
        </div>
      </div>
    </footer>
  );
};
