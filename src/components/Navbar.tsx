import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Activity,
  Shield,
  Search,
  Globe2,
  BookOpen,
  HelpCircle,
  Menu,
  X,
  Zap,
  Eye,
  EyeOff,
} from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  reducedMotion?: boolean;
  onToggleReducedMotion?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  reducedMotion = false,
  onToggleReducedMotion,
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleMute = () => {
    const newMuted = soundFx.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundFx.playClick();
    }
  };

  const navItems = [
    { id: 'simulation', label: 'Data Journey', icon: Activity },
    { id: 'encryption', label: 'Encryption Lab', icon: Shield },
    { id: 'detective', label: 'Network Detective', icon: Search },
    { id: 'worldmap', label: 'Global Cables Map', icon: Globe2 },
    { id: 'knowledge', label: 'How It Works', icon: BookOpen },
    { id: 'quiz', label: 'Knowledge Quiz', icon: HelpCircle },
  ];

  const handleNavClick = (id: string) => {
    soundFx.playClick();
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-[#070913]/95 backdrop-blur-xl border-b border-cyan-500/25 py-2.5 sm:py-3 shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
          : 'bg-[#070913]/70 backdrop-blur-md border-b border-white/5 py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <button
          id="brand-logo-button"
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl p-1 transition-transform active:scale-95 shrink-0"
          aria-label="DataFlow Homepage - Jump to Top"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all">
            <div className="w-full h-full bg-[#0b0f1d] rounded-[10px] flex items-center justify-center">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
            </div>
            {/* Pulsing online indicator */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                DataFlow
              </span>
              <span className="hidden xs:inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                SIM
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono tracking-wide hidden md:block">
              The Invisible Journey of Internet Data
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-1 bg-[#0e1428]/85 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md shadow-inner"
          aria-label="Main Navigation Menu"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono font-medium transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[40px] ${
                  isActive
                    ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.35)] font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls: Reduced Motion & Sound Toggle & Quick Launch */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reduced Motion Toggle Button */}
          {onToggleReducedMotion && (
            <button
              id="reduced-motion-toggle-btn"
              onClick={onToggleReducedMotion}
              className={`min-h-[42px] min-w-[42px] px-2.5 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-mono border transition-all cursor-pointer ${
                reducedMotion
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80'
              }`}
              title={reducedMotion ? 'Animations Disabled (Click to Enable Motion)' : 'Animations Enabled (Click to Reduce Motion)'}
              aria-label={reducedMotion ? 'Reduced Motion Active - Click to Enable Animations' : 'Reduce Motion - Click to Disable Animations'}
              aria-pressed={reducedMotion}
            >
              {reducedMotion ? (
                <>
                  <EyeOff className="w-4 h-4 text-purple-400 shrink-0" aria-hidden="true" />
                  <span className="hidden xl:inline text-[11px] font-semibold">STATIC</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                  <span className="hidden xl:inline text-[11px]">MOTION</span>
                </>
              )}
            </button>
          )}

          {/* Sound Toggle Button */}
          <button
            id="sound-fx-toggle-button"
            onClick={handleToggleMute}
            className={`min-h-[42px] min-w-[42px] px-2.5 sm:px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-mono border transition-all cursor-pointer ${
              !isMuted
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:bg-cyan-500/25'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80'
            }`}
            title={isMuted ? 'Turn Sound Effects ON' : 'Mute Sound Effects'}
            aria-label={isMuted ? 'Sound Muted - Click to Unmute' : 'Sound Active - Click to Mute'}
            aria-pressed={!isMuted}
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" aria-hidden="true" />
                <span className="hidden md:inline font-semibold">SOUND</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="hidden md:inline">MUTED</span>
              </>
            )}
          </button>

          {/* Quick Launch CTA Button */}
          <button
            id="quick-start-simulation-btn"
            onClick={() => handleNavClick('simulation')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 min-h-[42px] rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-display font-bold hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            aria-label="Launch 6-stage interactive simulator"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-200 shrink-0" aria-hidden="true" />
            <span>Launch Sim</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            id="mobile-menu-toggle-button"
            onClick={() => {
              soundFx.playClick();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="lg:hidden min-h-[42px] min-w-[42px] p-2 rounded-xl glass-panel text-slate-200 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center justify-center"
            aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden px-3 sm:px-4 pt-3 pb-6 bg-[#080d1e]/98 border-b border-cyan-500/30 space-y-2 animate-fadeIn shadow-2xl backdrop-blur-2xl max-h-[calc(100vh-60px)] overflow-y-auto"
          role="region"
          aria-label="Mobile Navigation Menu"
        >
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 px-3 py-1 flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold">Navigation Menu</span>
            <span className="text-slate-300">Jump to section</span>
          </div>

          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full p-3.5 rounded-xl flex items-center justify-between text-sm font-mono transition-all cursor-pointer min-h-[48px] active:scale-98 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'text-slate-200 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-500/30 text-cyan-300' : 'bg-slate-800 text-slate-300'}`}>
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  {isActive ? (
                    <span className="text-xs text-cyan-400 font-mono font-bold">● Active</span>
                  ) : (
                    <span className="text-slate-400 text-xs" aria-hidden="true">➔</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile accessibility quick toggles */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
            {onToggleReducedMotion && (
              <button
                onClick={onToggleReducedMotion}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center justify-center gap-1.5 min-h-[44px]"
                aria-pressed={reducedMotion}
              >
                {reducedMotion ? <EyeOff className="w-4 h-4 text-purple-400" /> : <Eye className="w-4 h-4 text-slate-300" />}
                <span>{reducedMotion ? 'Static Mode ON' : 'Motion ON'}</span>
              </button>
            )}
            <button
              onClick={handleToggleMute}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center justify-center gap-1.5 min-h-[44px]"
              aria-pressed={!isMuted}
            >
              {!isMuted ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span>{!isMuted ? 'Sound ON' : 'Muted'}</span>
            </button>
          </div>

          {/* Quick Sim trigger inside mobile menu for easy access */}
          <div className="pt-2">
            <button
              onClick={() => handleNavClick('simulation')}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-display font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer min-h-[48px]"
            >
              <Zap className="w-4 h-4 text-cyan-200" aria-hidden="true" />
              <span>Launch 6-Stage Simulator</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
