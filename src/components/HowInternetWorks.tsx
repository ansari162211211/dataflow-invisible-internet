import React, { useState, useEffect, useRef } from 'react';
import { KNOWLEDGE_TOPICS } from '../data/knowledgeCards';
import { KnowledgeTopic } from '../types';
import { soundFx } from '../utils/audio';
import {
  BookOpen,
  Package,
  Network,
  Server,
  Building2,
  Zap,
  Globe,
  Sparkles,
  ArrowRight,
  X,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

interface HowInternetWorksProps {
  onAnnounce?: (msg: string) => void;
}

export const HowInternetWorks: React.FC<HowInternetWorksProps> = ({ onAnnounce }) => {
  const [selectedTopic, setSelectedTopic] = useState<KnowledgeTopic | null>(null);
  const modalCloseBtnRef = useRef<HTMLButtonElement>(null);

  // Escape key listener for deep dive modal
  useEffect(() => {
    if (!selectedTopic) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundFx.playClick();
        setSelectedTopic(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    setTimeout(() => modalCloseBtnRef.current?.focus(), 50);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTopic]);

  const getTopicIcon = (iconName: string, size = 'w-6 h-6') => {
    switch (iconName) {
      case 'Package':
        return <Package className={size} aria-hidden="true" />;
      case 'Network':
        return <Network className={size} aria-hidden="true" />;
      case 'Server':
        return <Server className={size} aria-hidden="true" />;
      case 'Building2':
        return <Building2 className={size} aria-hidden="true" />;
      case 'Zap':
        return <Zap className={size} aria-hidden="true" />;
      case 'Globe':
        return <Globe className={size} aria-hidden="true" />;
      default:
        return <BookOpen className={size} aria-hidden="true" />;
    }
  };

  return (
    <section
      id="knowledge"
      className="relative py-14 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16 sm:scroll-mt-20 w-full"
      aria-label="How the Internet Works Educational Cards"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] sm:text-xs font-mono uppercase tracking-wider mb-3 sm:mb-4">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" aria-hidden="true" />
          <span>Visualizing the Invisible: Core Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3 sm:mb-4 break-words">
          How the Internet Actually Works
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-300 px-1 leading-relaxed">
          The fundamental building blocks powering the global invisible network, explained in simple English with student-friendly analogies.
        </p>
      </div>

      {/* 6 Visual Knowledge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {KNOWLEDGE_TOPICS.map((topic) => {
          return (
            <div
              key={topic.id}
              id={`knowledge-card-${topic.id}`}
              className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:-translate-y-1"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shrink-0" aria-hidden="true">
                      {getTopicIcon(topic.iconName, 'w-5 h-5 sm:w-6 sm:h-6')}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block truncate">
                        Concept #{topic.number}
                      </span>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyan-300 transition-colors truncate">
                        {topic.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-xl sm:text-2xl shrink-0 ml-2" aria-hidden="true">{topic.emoji}</span>
                </div>

                <p className="text-xs font-mono text-purple-300 mb-2 sm:mb-3 font-semibold">
                  {topic.subtitle}
                </p>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 sm:mb-4">
                  {topic.summary}
                </p>

                {/* Student Analogy Box */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 mb-1 font-bold">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Real-World Analogy:</span>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-snug">
                    "{topic.analogy}"
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                id={`explore-topic-${topic.id}-btn`}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedTopic(topic);
                  onAnnounce?.(`Opened details for Concept ${topic.number}: ${topic.title}. ${topic.summary}`);
                }}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-200 hover:text-cyan-300 font-mono text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label={`Read deep dive on ${topic.title}`}
              >
                <span>Read Deep Dive</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Deep Dive Topic Modal */}
      {selectedTopic && (
        <div
          id="topic-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="topic-modal-title"
        >
          <div className="relative w-full max-w-2xl bg-[#0d1224] border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 to-purple-950/40 shrink-0">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xl shrink-0" aria-hidden="true">
                  {getTopicIcon(selectedTopic.iconName, 'w-5 h-5 sm:w-6 sm:h-6')}
                </div>
                <div className="min-w-0">
                  <h3 id="topic-modal-title" className="font-display text-lg sm:text-2xl font-bold text-white truncate">
                    {selectedTopic.title} {selectedTopic.emoji}
                  </h3>
                  <p className="text-[11px] sm:text-xs font-mono text-cyan-300 truncate font-semibold">{selectedTopic.subtitle}</p>
                </div>
              </div>

              <button
                ref={modalCloseBtnRef}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedTopic(null);
                }}
                className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer shrink-0 ml-2"
                aria-label="Close topic modal dialog"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
              <div>
                <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-1.5 sm:mb-2">
                  Overview
                </h4>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {selectedTopic.summary}
                </p>
              </div>

              {/* How it Works Step by step */}
              <div>
                <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold mb-2.5 sm:mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" aria-hidden="true" /> How It Works Behind The Scenes:
                </h4>
                <div className="space-y-2 sm:space-y-2.5">
                  {selectedTopic.howItWorks.map((step, i) => (
                    <div
                      key={i}
                      className="p-3 sm:p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-2.5 sm:gap-3"
                    >
                      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] sm:text-xs font-bold flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                        {i + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun Fact */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-purple-500/30 flex items-start gap-2.5 sm:gap-3">
                <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-purple-300 font-bold block mb-1">
                    Mind-Blowing Internet Fact:
                  </span>
                  <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
                    {selectedTopic.funFact}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-white/10 bg-slate-950/90 flex justify-end shrink-0">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setSelectedTopic(null);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-display font-bold text-xs sm:text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
              >
                Got It! (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
