import React, { useEffect, useRef } from 'react';
import { soundFx } from '../utils/audio';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Globe,
  Cpu,
  ArrowDown,
  Sparkles,
  MousePointerClick,
  Layers,
} from 'lucide-react';

interface HeroProps {
  onVisualizeClick: () => void;
  onExploreEncryptionClick?: () => void;
  reducedMotion?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onVisualizeClick,
  onExploreEncryptionClick,
  reducedMotion = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleExploreEncryption = (e: React.MouseEvent) => {
    e.preventDefault();
    soundFx.playClick();
    if (onExploreEncryptionClick) {
      onExploreEncryptionClick();
    } else {
      const el = document.getElementById('encryption');
      if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  // Background Interactive Network Mesh
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight * 0.95);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight * 0.95;
      if (reducedMotion) {
        drawStatic();
      }
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (reducedMotion) return;
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    interface NetworkNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulseVal: number;
    }

    const colors = ['#06b6d4', '#8b5cf6', '#3b82f6', '#10b981'];
    const nodeCount = Math.min(45, Math.max(16, Math.floor(width / 32)));
    const nodes: NetworkNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseVal: Math.random() * Math.PI,
      });
    }

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(6, 182, 212, 0.15)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = n1.color;
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reducedMotion) {
      drawStatic();
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
      };
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw mesh links between nodes
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;
        n1.pulseVal += 0.025;

        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.22;
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Connect to user mouse position gently
        const mdx = n1.x - mouse.x;
        const mdy = n1.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          const mAlpha = (1 - mdist / 140) * 0.5;
          ctx.strokeStyle = `rgba(168, 85, 247, ${mAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Draw node
        const pulseRadius = n1.radius + Math.sin(n1.pulseVal) * 0.8;
        ctx.fillStyle = n1.color;
        ctx.shadowColor = n1.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, Math.max(0.5, pulseRadius), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  return (
    <section
      id="hero-section"
      className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 sm:pt-28 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8 overflow-hidden w-full"
      aria-label="DataFlow Hero - The Invisible Journey of Internet Data"
    >
      {/* Background Interactive Network Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto z-0"
        aria-hidden="true"
      />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Ambient Glowing Orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-cyan-500/15 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 right-1/4 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-purple-600/15 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center w-full">
        {/* Hackathon Theme Pill */}
        <div
          id="hackathon-theme-badge"
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#0e1428]/95 border border-cyan-500/40 text-cyan-300 text-[11px] sm:text-xs font-mono uppercase tracking-wider mb-5 sm:mb-6 shadow-[0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-md max-w-full"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
          <span className="font-bold text-white tracking-normal">Theme:</span>
          <span className="truncate text-cyan-300 font-semibold">Visualizing the Invisible</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" aria-hidden="true" />
        </div>

        {/* Hero Title */}
        <h1
          id="hero-main-title"
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white max-w-3xl leading-[1.12] mb-4 sm:mb-6 break-words"
        >
          What Happens When You{' '}
          <span className="inline-block">
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.6)]">
              Click Send?
            </span>
          </span>
        </h1>

        {/* Clear, Engaging Purpose Subtitle */}
        <p
          id="hero-subtitle-description"
          className="text-sm sm:text-lg md:text-xl text-slate-200 max-w-2xl font-normal leading-relaxed mb-6 sm:mb-8 px-1"
        >
          Ever wondered how your messages cross the globe in milliseconds?
          <strong className="text-cyan-300 font-bold"> DataFlow</strong> makes the invisible journey of internet data visible—turning radio waves, submarine fiber cables, and packets into an intuitive interactive playground.
        </p>

        {/* First-Time User 3-Step Quick Guide */}
        <div className="mb-8 sm:mb-10 p-3 sm:px-6 sm:py-3.5 rounded-2xl bg-[#0d1326]/85 border border-cyan-500/30 backdrop-blur-md max-w-xl w-full shadow-lg">
          <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-2 flex items-center justify-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>How to start (In 3 easy steps):</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-xs font-mono text-slate-300">
            <div className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="block text-cyan-300 font-bold text-[11px] sm:text-xs mb-0.5">1. Pick Text</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 leading-none">Type or preset</span>
            </div>
            <div className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="block text-cyan-300 font-bold text-[11px] sm:text-xs mb-0.5">2. Click Send</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 leading-none">Slice to bits</span>
            </div>
            <div className="p-1.5 sm:p-2 rounded-xl bg-white/5 border border-white/5">
              <span className="block text-cyan-300 font-bold text-[11px] sm:text-xs mb-0.5">3. Watch Flow</span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 leading-none">6 physical hops</span>
            </div>
          </div>
        </div>

        {/* Primary Glowing Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-10 sm:mb-14 w-full sm:w-auto justify-center max-w-sm sm:max-w-none">
          <button
            id="visualize-data-hero-button"
            onClick={() => {
              soundFx.playClick();
              soundFx.playLaunch();
              onVisualizeClick();
            }}
            className="group relative inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-display font-bold text-base sm:text-lg shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto border border-cyan-300/40 cursor-pointer min-h-[48px]"
            title="Click to start the interactive simulation"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-200 fill-cyan-200 group-hover:scale-125 transition-transform" />
              <span>Visualize My Data</span>
              <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
          </button>

          <button
            id="explore-encryption-hero-button"
            onClick={handleExploreEncryption}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl glass-panel text-slate-200 hover:text-white hover:border-purple-500/40 font-medium text-sm sm:text-base transition-all duration-200 hover:bg-white/10 active:scale-98 w-full sm:w-auto cursor-pointer min-h-[48px]"
            title="Explore encryption and cryptography"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Explore Encryption</span>
          </button>
        </div>

        {/* Quick Educational Fact Bar */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl">
          <div className="glass-panel p-3 sm:p-3.5 rounded-2xl border border-white/5 text-center transition-all hover:border-cyan-500/30">
            <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-mono text-xs sm:text-base lg:text-lg font-bold text-white">~200,000 km/s</span>
            </div>
            <p className="text-[9px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-mono">Fiber Laser Speed</p>
          </div>

          <div className="glass-panel p-3 sm:p-3.5 rounded-2xl border border-white/5 text-center transition-all hover:border-indigo-500/30">
            <div className="flex items-center justify-center gap-1 text-indigo-400 mb-1">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-mono text-xs sm:text-base lg:text-lg font-bold text-white">550+ Cables</span>
            </div>
            <p className="text-[9px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-mono">Ocean Seabed Trunks</p>
          </div>

          <div className="glass-panel p-3 sm:p-3.5 rounded-2xl border border-white/5 text-center transition-all hover:border-purple-500/30">
            <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-mono text-xs sm:text-base lg:text-lg font-bold text-white">1,500 Bytes</span>
            </div>
            <p className="text-[9px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-mono">Max Packet MTU</p>
          </div>

          <div className="glass-panel p-3 sm:p-3.5 rounded-2xl border border-white/5 text-center transition-all hover:border-emerald-500/30">
            <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-mono text-xs sm:text-base lg:text-lg font-bold text-white">AES-256 / TLS</span>
            </div>
            <p className="text-[9px] sm:text-[11px] text-slate-400 uppercase tracking-wider font-mono">Military-Grade Lock</p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={onVisualizeClick}
          aria-label="Scroll down to simulation"
          className="mt-8 sm:mt-12 text-slate-400 hover:text-cyan-400 transition-colors flex flex-col items-center gap-1 group cursor-pointer"
        >
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 group-hover:text-cyan-300">
            Scroll to Simulator
          </span>
          <ArrowDown className="w-4 h-4 animate-bounce text-cyan-400" />
        </button>
      </div>
    </section>
  );
};
