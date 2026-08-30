import React, { useState, useEffect, useRef } from 'react';
import { GLOBAL_ROUTES } from '../data/globalRoutes';
import { soundFx } from '../utils/audio';
import { GlobalRoute } from '../types';
import {
  Globe2,
  Navigation,
  Clock,
  Compass,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
} from 'lucide-react';

export const GlobalDataJourney: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('india-usa');
  const [packetProgress, setPacketProgress] = useState<number>(0); // 0 to 1
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);

  // Filter routes to prioritize requested India routes first
  const routes = GLOBAL_ROUTES;
  const currentRoute: GlobalRoute =
    routes.find((r) => r.id === selectedRouteId) || routes[0];

  const handleSelectRoute = (routeId: string) => {
    soundFx.playClick();
    soundFx.playHop(2);
    setSelectedRouteId(routeId);
    setPacketProgress(0);
    setIsSimulating(true);
  };

  // Continuous animation loop for smooth data packet movement across the world map
  useEffect(() => {
    if (!isSimulating) return;

    let animId: number;
    let lastTime: number | null = null;

    const animate = (time: number) => {
      if (lastTime != null) {
        const delta = time - lastTime;
        // Journey cycle takes ~3500ms scaled by speed multiplier
        const duration = 3500 / speedMultiplier;
        setPacketProgress((prev) => {
          const next = prev + delta / duration;
          if (next >= 1) {
            soundFx.playArrival();
            return 0; // Loop seamlessly
          }
          return next;
        });
      }
      lastTime = time;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isSimulating, selectedRouteId, speedMultiplier]);

  // Compute interpolated packet position (x, y) % on SVG canvas coordinate space
  const getPacketPosition = () => {
    const from = currentRoute.from.coords;
    const to = currentRoute.to.coords;
    const hops = currentRoute.intermediateHops;

    const points = [from, ...hops.map((h) => h.coords), to];
    const totalSegments = points.length - 1;
    const currentSegmentFloat = packetProgress * totalSegments;
    const segIdx = Math.min(Math.floor(currentSegmentFloat), totalSegments - 1);
    const segProgress = currentSegmentFloat - segIdx;

    const pA = points[segIdx];
    const pB = points[segIdx + 1];

    const curX = pA[0] + (pB[0] - pA[0]) * segProgress;
    const curY = pA[1] + (pB[1] - pA[1]) * segProgress;

    return { x: curX, y: curY, currentHopIndex: segIdx };
  };

  const packetPos = getPacketPosition();

  // Create SVG path string for the route
  const getSvgPathString = () => {
    const points = [
      currentRoute.from.coords,
      ...currentRoute.intermediateHops.map((h) => h.coords),
      currentRoute.to.coords,
    ];

    return points.reduce((acc, pt, idx) => {
      const svgX = (pt[0] / 100) * 1000;
      const svgY = (pt[1] / 100) * 500;
      if (idx === 0) return `M ${svgX} ${svgY}`;

      const prevPt = points[idx - 1];
      const prevX = (prevPt[0] / 100) * 1000;
      const prevY = (prevPt[1] / 100) * 500;
      const midX = (prevX + svgX) / 2;
      const midY = Math.min(prevY, svgY) - 25; // Gentle upward curved arc

      return `${acc} Q ${midX} ${midY} ${svgX} ${svgY}`;
    }, '');
  };

  // Convert coordinate percentages to SVG 1000x500 box values
  const toSvgX = (percentX: number) => (percentX / 100) * 1000;
  const toSvgY = (percentY: number) => (percentY / 100) * 500;

  return (
    <section
      id="worldmap"
      className="relative py-14 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16 sm:scroll-mt-20 w-full"
      aria-label="Global Data Journey World Map"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-mono uppercase tracking-wider mb-3 sm:mb-4">
          <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
          <span>Visualizing the Invisible: Subsea Fiber Map</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3 sm:mb-4 break-words">
          Global Data Journey
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-300 px-1 leading-relaxed">
          See how your internet packets cross continents and deep ocean beds at light-speed to reach international servers.
        </p>
      </div>

      {/* Route Switcher Buttons */}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div className="text-center">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">
            Select an Example Route:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {routes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              return (
                <button
                  key={route.id}
                  id={`route-btn-${route.id}`}
                  onClick={() => handleSelectRoute(route.id)}
                  className={`px-4 sm:px-6 py-3 rounded-2xl font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 sm:gap-2.5 transition-all duration-200 cursor-pointer min-h-[48px] ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.6)] border border-cyan-300/40 scale-102 sm:scale-105'
                      : 'glass-panel text-slate-300 hover:text-white hover:border-cyan-500/30'
                  }`}
                >
                  <span className="text-base">{route.from.flag}</span>
                  <span>{route.from.country}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
                  <span className="text-base">{route.to.flag}</span>
                  <span>{route.to.country}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Playback Controls & Speed Toggle */}
        <div className="flex items-center justify-center sm:justify-end gap-2.5 flex-wrap">
          <div className="flex items-center bg-[#070b18] border border-white/10 rounded-xl p-1 text-xs font-mono">
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                id={`global-speed-btn-${spd}x`}
                onClick={() => {
                  soundFx.playClick();
                  setSpeedMultiplier(spd);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-bold ${
                  speedMultiplier === spd
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            id="global-map-toggle-play-btn"
            onClick={() => {
              soundFx.playClick();
              setIsSimulating(!isSimulating);
            }}
            className="px-4 py-2 rounded-xl glass-panel text-xs font-mono text-cyan-300 hover:text-white hover:border-cyan-400 flex items-center gap-1.5 cursor-pointer min-h-[40px]"
            title={isSimulating ? 'Pause Map Simulation' : 'Resume Map Simulation'}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            id="global-map-reset-btn"
            onClick={() => {
              soundFx.playClick();
              setPacketProgress(0);
              setIsSimulating(true);
            }}
            className="p-2 rounded-xl glass-panel text-slate-400 hover:text-white hover:border-cyan-400 flex items-center justify-center cursor-pointer min-h-[40px] min-w-[40px]"
            title="Restart Transit along Route"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive World Map Card */}
      <div className="glass-panel p-3 sm:p-6 lg:p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
        {/* Source and Destination Summary Banner */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-white/10 mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{currentRoute.from.flag}</span>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wide block">
                1. SOURCE (ORIGIN)
              </span>
              <strong className="text-sm sm:text-base text-white">
                {currentRoute.from.city}, {currentRoute.from.country}
              </strong>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-cyan-400">
            <span className="h-0.5 w-8 bg-gradient-to-r from-cyan-400 to-purple-400" />
            <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
            <span className="h-0.5 w-8 bg-gradient-to-r from-purple-400 to-pink-400" />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{currentRoute.to.flag}</span>
            <div>
              <span className="text-[10px] font-mono font-bold text-pink-400 uppercase tracking-wide block">
                2. DESTINATION (TARGET)
              </span>
              <strong className="text-sm sm:text-base text-white">
                {currentRoute.to.city}, {currentRoute.to.country}
              </strong>
            </div>
          </div>
        </div>

        {/* Responsive World Map SVG Container */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[2/1] min-h-[220px] bg-[#070b18] rounded-2xl border border-white/10 overflow-hidden shadow-inner flex items-center justify-center">
          {/* Cyber Grid Lines */}
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] pointer-events-none"
            aria-hidden="true"
          />

          {/* SVG Map Canvas */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            aria-label="Stylized world map with internet undersea cables"
          >
            <defs>
              <linearGradient id="routeGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>

              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Stylized Continent Outlines */}
            <g fill="rgba(30, 41, 59, 0.45)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.8">
              {/* North America */}
              <path d="M 120 100 Q 180 80 260 110 Q 300 160 270 230 Q 230 250 180 280 Q 150 240 110 200 Z" />
              {/* South America */}
              <path d="M 230 280 Q 320 310 300 400 Q 260 480 230 430 Q 210 340 230 280 Z" />
              {/* Europe */}
              <path d="M 440 100 Q 520 80 540 140 Q 500 180 440 160 Q 420 120 440 100 Z" />
              {/* Africa */}
              <path d="M 430 180 Q 550 180 540 300 Q 500 420 440 380 Q 400 280 430 180 Z" />
              {/* Asia */}
              <path d="M 540 90 Q 750 70 850 140 Q 860 260 740 280 Q 640 260 560 200 Z" />
              {/* India */}
              <path d="M 640 210 Q 710 210 700 300 Q 660 330 630 290 Q 620 240 640 210 Z" />
              {/* Australia */}
              <path d="M 780 340 Q 880 330 870 420 Q 800 460 770 410 Z" />
            </g>

            {/* Background Subsea Cable Mesh */}
            <g stroke="rgba(6, 182, 212, 0.12)" strokeWidth="1" strokeDasharray="3 3" fill="none">
              <path d="M 240 170 Q 350 140 460 140" />
              <path d="M 460 150 Q 550 230 660 250" />
              <path d="M 660 250 Q 740 280 780 290" />
              <path d="M 780 290 Q 840 240 850 160" />
              <path d="M 850 160 Q 950 120 150 150" />
            </g>

            {/* 3. Glowing Animated Route Line */}
            <path
              d={getSvgPathString()}
              fill="none"
              stroke="rgba(6, 182, 212, 0.25)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={getSvgPathString()}
              fill="none"
              stroke="url(#routeGlowGrad)"
              strokeWidth="4"
              filter="url(#glowEffect)"
              strokeLinecap="round"
            />

            {/* Intermediate Landing Station Hops */}
            {currentRoute.intermediateHops.map((hop, idx) => {
              const svgX = toSvgX(hop.coords[0]);
              const svgY = toSvgY(hop.coords[1]);
              return (
                <g key={idx}>
                  <circle cx={svgX} cy={svgY} r="5" fill="#a855f7" />
                  <circle cx={svgX} cy={svgY} r="10" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.6" />
                </g>
              );
            })}

            {/* 1. Highlight Source Location (Origin) */}
            <g>
              <circle
                cx={toSvgX(currentRoute.from.coords[0])}
                cy={toSvgY(currentRoute.from.coords[1])}
                r="8"
                fill="#06b6d4"
                filter="url(#glowEffect)"
              />
              <circle
                cx={toSvgX(currentRoute.from.coords[0])}
                cy={toSvgY(currentRoute.from.coords[1])}
                r="16"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                opacity="0.8"
              >
                <animate attributeName="r" values="8;22;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Origin text label on SVG */}
              <text
                x={toSvgX(currentRoute.from.coords[0])}
                y={toSvgY(currentRoute.from.coords[1]) + 24}
                textAnchor="middle"
                fill="#06b6d4"
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {currentRoute.from.city}
              </text>
            </g>

            {/* 2. Highlight Destination Location */}
            <g>
              <circle
                cx={toSvgX(currentRoute.to.coords[0])}
                cy={toSvgY(currentRoute.to.coords[1])}
                r="8"
                fill="#ec4899"
                filter="url(#glowEffect)"
              />
              <circle
                cx={toSvgX(currentRoute.to.coords[0])}
                cy={toSvgY(currentRoute.to.coords[1])}
                r="16"
                fill="none"
                stroke="#ec4899"
                strokeWidth="2.5"
                opacity="0.8"
              >
                <animate attributeName="r" values="8;22;8" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Destination text label on SVG */}
              <text
                x={toSvgX(currentRoute.to.coords[0])}
                y={toSvgY(currentRoute.to.coords[1]) + 24}
                textAnchor="middle"
                fill="#ec4899"
                fontSize="12"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {currentRoute.to.city}
              </text>
            </g>

            {/* 4. Animated Moving Data Packets */}
            <g>
              {/* Main Glowing Data Packet Aura */}
              <circle
                cx={toSvgX(packetPos.x)}
                cy={toSvgY(packetPos.y)}
                r="10"
                fill="#ffffff"
                filter="url(#glowEffect)"
              />
              <circle
                cx={toSvgX(packetPos.x)}
                cy={toSvgY(packetPos.y)}
                r="18"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                opacity="0.9"
              >
                <animate attributeName="r" values="10;20;10" dur="0.8s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>

          {/* Map Overlay Badge */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/10 text-[10px] sm:text-xs font-mono max-w-[90%] truncate">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="text-slate-300 hidden xs:inline">Transiting Corridor:</span>
            <span className="text-cyan-300 font-bold truncate">{currentRoute.from.city} ➔ {currentRoute.to.city}</span>
          </div>

          <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-400 border border-white/5">
            Progress: {Math.round(packetProgress * 100)}%
          </div>
        </div>

        {/* 5. Simulated Educational Information Metrics Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {/* Approximate Distance */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-cyan-400 mb-1.5 sm:mb-2">
              <Navigation className="w-4 h-4" />
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">
                Approximate Distance
              </span>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-extrabold text-white">
              {currentRoute.distanceKm.toLocaleString()}{' '}
              <span className="text-sm sm:text-base text-cyan-400">km</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              ~{(currentRoute.distanceKm * 0.621371).toFixed(0)} miles across land & seabed
            </p>
          </div>

          {/* Estimated Latency */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-purple-400 mb-1.5 sm:mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">
                Estimated Latency
              </span>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-extrabold text-white">
              ~{currentRoute.estimatedLatencyMs}{' '}
              <span className="text-sm sm:text-base text-purple-400">ms (RTT)</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              Speed of light in silica glass optical fiber
            </p>
          </div>

          {/* Number of Network Hops */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-emerald-400 mb-1.5 sm:mb-2">
              <Compass className="w-4 h-4" />
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-400">
                Number of Network Hops
              </span>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-mono font-extrabold text-white">
              ~{currentRoute.typicalHops}{' '}
              <span className="text-sm sm:text-base text-emerald-400">Routers & IXPs</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
              Intermediate routers & subsea landing stations
            </p>
          </div>
        </div>

        {/* Subsea Cable Details */}
        <div className="mt-3 sm:mt-4 p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <span className="text-[11px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
              Submarine Fiber Cables along this Route:
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {currentRoute.subseaCables.map((cable, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-mono"
                >
                  ⚡ {cable}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
            {currentRoute.description}
          </p>
        </div>

        {/* First-Time User Key Takeaway: Cables vs Satellites */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 border border-cyan-500/30">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs sm:text-sm font-display mb-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>💡 Key Takeaway: Why Does the World Use Deep-Sea Cables Instead of Satellites?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Over <strong>99% of all international internet traffic</strong> is carried by undersea fiber-optic glass cables resting on ocean beds. Optical fiber carries hundreds of terabits per second at nearly 200,000 km/s with minimal lag, whereas satellite signals must travel 35,000+ km into space and back, causing higher latency and weather interference.
          </p>
        </div>

        {/* Clear Educational Simulation Disclaimer */}
        <div
          id="simulation-educational-disclaimer"
          className="mt-4 sm:mt-6 p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3"
          role="note"
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px] sm:text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300 font-bold block mb-0.5 uppercase tracking-wide">
              Educational Simulation:
            </strong>
            All latency, distance, and hop values shown here are part of an educational simulation based on average fiber propagation speeds and standard geographic routing. This simulation does not claim to represent exact real-time internet routing or live ISP traceroutes.
          </div>
        </div>
      </div>
    </section>
  );
};
