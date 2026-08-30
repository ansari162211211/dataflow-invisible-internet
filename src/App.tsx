import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { InteractiveSimulation } from './components/InteractiveSimulation';
import { EncryptionSection } from './components/EncryptionSection';
import { NetworkDetective } from './components/NetworkDetective';
import { GlobalDataJourney } from './components/GlobalDataJourney';
import { HowInternetWorks } from './components/HowInternetWorks';
import { InteractiveQuiz } from './components/InteractiveQuiz';
import { Footer } from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isSimEncryptionEnabled, setIsSimEncryptionEnabled] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [announcement, setAnnouncement] = useState<string>('Welcome to DataFlow. An interactive educational journey of internet data.');

  // Safe announcement callback to prevent setState during render of child components
  const handleAnnounce = React.useCallback((msg: string) => {
    setTimeout(() => {
      setAnnouncement(msg);
    }, 0);
  }, []);

  // Handle system reduced motion preference changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Sync reduced-motion class on HTML root element
  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  // Smooth navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    setAnnouncement(`Navigated to ${sectionId} section.`);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    }
  };

  // Intersection observer to track which section is in view for navbar highlight
  useEffect(() => {
    const sectionIds = ['hero', 'simulation', 'encryption', 'worldmap', 'knowledge', 'quiz'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070913] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Skip to Main Content Link for Keyboard and Screen Reader Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Screen Reader Live Region for Dynamic Announcements */}
      <div
        id="global-sr-announcer"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Fixed Futuristic Navigation with Accessibility Controls */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => {
          const next = !reducedMotion;
          setReducedMotion(next);
          setAnnouncement(next ? 'Reduced motion activated. Fast animations disabled.' : 'Animations enabled.');
        }}
      />

      {/* Main Landmark Content Sections */}
      <main id="main-content" tabIndex={-1} className="outline-none">
        {/* Section 1: Hero */}
        <div id="hero">
          <Hero
            onVisualizeClick={() => handleNavigate('simulation')}
            onExploreEncryptionClick={() => handleNavigate('encryption')}
            reducedMotion={reducedMotion}
          />
        </div>

        {/* Section 2: Interactive 6-Stage Simulation */}
        <InteractiveSimulation
          isGlobalEncrypted={isSimEncryptionEnabled}
          reducedMotion={reducedMotion}
          onAnnounce={handleAnnounce}
        />

        {/* Section 3: Interactive Encryption Section */}
        <EncryptionSection
          onToggleSimEncryption={(enabled) => setIsSimEncryptionEnabled(enabled)}
          reducedMotion={reducedMotion}
          onAnnounce={handleAnnounce}
        />

        {/* Section 4: Network Detective Diagnostic Lab */}
        <NetworkDetective
          reducedMotion={reducedMotion}
          onAnnounce={handleAnnounce}
        />

        {/* Section 5: Global Data Journey & World Map */}
        <GlobalDataJourney
          reducedMotion={reducedMotion}
          onAnnounce={handleAnnounce}
        />

        {/* Section 6: How the Internet Works Knowledge Cards */}
        <HowInternetWorks onAnnounce={handleAnnounce} />

        {/* Section 7: Interactive Student Knowledge Quiz */}
        <InteractiveQuiz onAnnounce={handleAnnounce} />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
