import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Wifi,
  WifiOff,
  Clock,
  AlertTriangle,
  Server,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Info,
  Radio,
  Activity,
  Zap,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface NetworkDetectiveProps {
  reducedMotion?: boolean;
  onAnnounce?: (msg: string) => void;
}

export type NetworkIssueType = 'weak-wifi' | 'high-latency' | 'packet-loss' | 'server-congestion';

interface DetectiveScenario {
  id: string;
  title: string;
  symptom: string;
  tagline: string;
  iconName: string;
  correctIssue: NetworkIssueType;
  options: {
    type: NetworkIssueType;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[];
  explanation: {
    problemStatement: string;
    visualDetail: string;
    solution: string;
    tip: string;
  };
}

export const NetworkDetective: React.FC<NetworkDetectiveProps> = ({
  reducedMotion = false,
  onAnnounce,
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<NetworkIssueType | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [animationTick, setAnimationTick] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const SCENARIOS: DetectiveScenario[] = [
    {
      id: 'video-call-freeze',
      title: 'Scenario 1: Video Call Freezing',
      symptom: '"Your video call is freezing and showing a pixelated screen. Can you find the problem?"',
      tagline: 'Diagnose Live Video Stutter',
      iconName: 'video',
      correctIssue: 'weak-wifi',
      options: [
        {
          type: 'weak-wifi',
          label: '1. Weak WiFi Signal',
          description: 'Unstable radio connection between laptop and wireless access point.',
          icon: <WifiOff className="w-5 h-5 text-rose-400" />,
        },
        {
          type: 'high-latency',
          label: '2. High Latency',
          description: 'Data packets take longer than usual to complete round-trip hops.',
          icon: <Clock className="w-5 h-5 text-amber-400" />,
        },
        {
          type: 'packet-loss',
          label: '3. Packet Loss',
          description: 'Missing chunks fail to arrive, causing gaps in the media stream.',
          icon: <AlertTriangle className="w-5 h-5 text-cyan-400" />,
        },
        {
          type: 'server-congestion',
          label: '4. Server Congestion',
          description: 'Cloud video host is overwhelmed with too many simultaneous calls.',
          icon: <Server className="w-5 h-5 text-purple-400" />,
        },
      ],
      explanation: {
        problemStatement: 'The signal between your device and router is weak, so data transmission becomes unstable.',
        visualDetail: 'Notice the radio wave pulses flickering and breaking between your laptop and the home router.',
        solution: 'Move closer to the router or improve signal coverage with a mesh repeater or ethernet cable.',
        tip: 'Walls, metal appliances, and physical distance degrade 5 GHz radio frequencies rapidly.',
      },
    },
    {
      id: 'online-gaming-lag',
      title: 'Scenario 2: Online Gaming Delay (Lag)',
      symptom: '"You press a button to jump in an online multiplayer game, but your character reacts 1.5 seconds later. What is causing this delay?"',
      tagline: 'Diagnose High Ping & Delay',
      iconName: 'game',
      correctIssue: 'high-latency',
      options: [
        {
          type: 'weak-wifi',
          label: '1. Weak WiFi Signal',
          description: 'Local wireless interference dropping the physical link.',
          icon: <WifiOff className="w-5 h-5 text-rose-400" />,
        },
        {
          type: 'high-latency',
          label: '2. High Latency',
          description: 'Data is taking longer than usual to travel through the network.',
          icon: <Clock className="w-5 h-5 text-amber-400" />,
        },
        {
          type: 'packet-loss',
          label: '3. Packet Loss',
          description: 'Game position packets are destroyed along fiber hops.',
          icon: <AlertTriangle className="w-5 h-5 text-cyan-400" />,
        },
        {
          type: 'server-congestion',
          label: '4. Server Congestion',
          description: 'Game matchmaking server is at maximum CPU capacity.',
          icon: <Server className="w-5 h-5 text-purple-400" />,
        },
      ],
      explanation: {
        problemStatement: 'Data is taking longer than usual to travel through the network.',
        visualDetail: 'Watch how slowly the orange packet crawls across multiple cross-country router hops before reaching the game server.',
        solution: 'Use a faster or more stable connection, select a geographically closer regional server, or connect via wired LAN.',
        tip: 'Latency (Ping) measures round-trip time in milliseconds. Overseas connections add 150-250ms of physical travel time.',
      },
    },
    {
      id: 'voice-chat-cutout',
      title: 'Scenario 3: Voice Chat Dropping Words',
      symptom: '"In a group voice chat, you only hear every second word your friend says: \'Hey... can... see... screen?\'. What is happening?"',
      tagline: 'Diagnose Broken Audio Stream',
      iconName: 'audio',
      correctIssue: 'packet-loss',
      options: [
        {
          type: 'weak-wifi',
          label: '1. Weak WiFi Signal',
          description: 'Antenna power fluctuating on local access point.',
          icon: <WifiOff className="w-5 h-5 text-rose-400" />,
        },
        {
          type: 'high-latency',
          label: '2. High Latency',
          description: 'All audio arrives smoothly, but delayed by several minutes.',
          icon: <Clock className="w-5 h-5 text-amber-400" />,
        },
        {
          type: 'packet-loss',
          label: '3. Packet Loss',
          description: 'Some packets do not arrive successfully and may need to be sent again.',
          icon: <AlertTriangle className="w-5 h-5 text-cyan-400" />,
        },
        {
          type: 'server-congestion',
          label: '4. Server Congestion',
          description: 'Global cloud provider experiencing total power blackout.',
          icon: <Server className="w-5 h-5 text-purple-400" />,
        },
      ],
      explanation: {
        problemStatement: 'Some packets do not arrive successfully and may need to be sent again.',
        visualDetail: 'Notice packets 2 and 4 disappearing in red sparks midway through the network journey instead of reaching the speaker.',
        solution: 'Check network stability, inspect damaged ethernet cables, or restart the modem to clear buffer collisions.',
        tip: 'Real-time UDP voice streams do not wait for lost packets to retransmit, resulting in missing syllables.',
      },
    },
    {
      id: 'concert-ticket-crash',
      title: 'Scenario 4: Ticket Website Loading Wheel',
      symptom: '"Millions of fans opened a ticket website at 10:00 AM sharp, and the page is spinning forever with a 503 error. What is the bottleneck?"',
      tagline: 'Diagnose Overloaded Web Service',
      iconName: 'web',
      correctIssue: 'server-congestion',
      options: [
        {
          type: 'weak-wifi',
          label: '1. Weak WiFi Signal',
          description: 'Your home router cannot emit radio waves.',
          icon: <WifiOff className="w-5 h-5 text-rose-400" />,
        },
        {
          type: 'high-latency',
          label: '2. High Latency',
          description: 'Ocean cable fiber optic light slowed down.',
          icon: <Clock className="w-5 h-5 text-amber-400" />,
        },
        {
          type: 'packet-loss',
          label: '3. Packet Loss',
          description: 'Local ISP blocked your specific computer.',
          icon: <AlertTriangle className="w-5 h-5 text-cyan-400" />,
        },
        {
          type: 'server-congestion',
          label: '4. Server Congestion',
          description: 'The server is handling many requests, causing delays.',
          icon: <Server className="w-5 h-5 text-purple-400" />,
        },
      ],
      explanation: {
        problemStatement: 'The server is handling many requests, causing delays.',
        visualDetail: 'See the massive pileup of packets backed up outside the destination web server queue waiting to be processed.',
        solution: 'Wait or try again later, or use CDN edge caching and auto-scaling load balancers.',
        tip: 'When incoming connections exceed server CPU and database memory thresholds, requests queue up and eventually time out.',
      },
    },
  ];

  const currentScenario = SCENARIOS[selectedScenarioIndex];
  const isCorrect = selectedAnswer === currentScenario.correctIssue;

  // Animation ticker for visual simulation canvas
  useEffect(() => {
    let startTime = performance.now();
    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      setAnimationTick(elapsed);
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const handleSelectOption = (type: NetworkIssueType) => {
    soundFx.playClick();
    setSelectedAnswer(type);
    setIsAnswerSubmitted(true);

    if (type === currentScenario.correctIssue) {
      soundFx.playArrival();
      onAnnounce?.(`Correct diagnosis! ${currentScenario.explanation.problemStatement} Solution: ${currentScenario.explanation.solution}`);
    } else {
      soundFx.playHop(1);
      onAnnounce?.(`Incorrect option chosen. Try investigating the visual clues again.`);
    }
  };

  const handleNextScenario = () => {
    soundFx.playClick();
    const nextIdx = (selectedScenarioIndex + 1) % SCENARIOS.length;
    setSelectedScenarioIndex(nextIdx);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    onAnnounce?.(`Loaded ${SCENARIOS[nextIdx].title}. ${SCENARIOS[nextIdx].symptom}`);
  };

  const handleResetCurrent = () => {
    soundFx.playClick();
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    onAnnounce?.(`Reset diagnosis for ${currentScenario.title}.`);
  };

  // Render dynamic problem visualization based on the diagnosed issue
  const renderVisualProblemCanvas = (issue: NetworkIssueType) => {
    const t = reducedMotion ? 1 : animationTick;

    if (issue === 'weak-wifi') {
      // Weak WiFi: flickering radio waves between laptop and router
      const flicker = Math.sin(t * 8) > 0.1;
      const opacity1 = (Math.sin(t * 5) + 1) / 2;
      const opacity2 = (Math.sin(t * 5 + 1) + 1) / 2;
      return (
        <div className="relative w-full h-44 sm:h-52 bg-[#060a17] rounded-2xl border border-rose-500/40 p-4 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_30px_rgba(244,63,94,0.15)]">
          {/* Top telemetry */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              DIAGNOSIS: WEAK WI-FI SIGNAL (-88 dBm)
            </span>
            <span className="text-slate-400">Packet Drop Rate: 42%</span>
          </div>

          {/* Node Track */}
          <div className="relative flex items-center justify-between px-4 sm:px-12 my-auto">
            {/* Device */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border-2 border-cyan-400/80 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <span className="font-mono text-xs font-bold">DEVICE</span>
              </div>
              <span className="text-[11px] font-mono text-slate-300">Your Laptop</span>
            </div>

            {/* Unstable Broken Radio Waves in the middle */}
            <div className="flex-1 mx-4 relative flex items-center justify-center h-16">
              {/* Radio wave arcs */}
              <div className="flex items-center justify-center gap-2 w-full">
                <div
                  className={`w-6 h-6 rounded-full border-2 border-dashed border-rose-500 transition-opacity ${
                    flicker ? 'opacity-100 scale-110' : 'opacity-20 scale-90'
                  }`}
                />
                <div
                  className="w-10 h-10 rounded-full border-2 border-rose-500/70 transition-opacity"
                  style={{ opacity: opacity1 }}
                />
                <div
                  className="w-14 h-14 rounded-full border-2 border-dashed border-rose-400/50 transition-opacity"
                  style={{ opacity: opacity2 }}
                />
                <div className="absolute text-center bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/50 text-[10px] font-mono text-rose-300 font-bold animate-pulse">
                  ⚠️ Signal Attenuation
                </div>
              </div>
            </div>

            {/* Router */}
            <div className="flex flex-col items-center gap-1.5 z-10">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border-2 border-rose-500 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                <WifiOff className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono text-slate-300">Home Router</span>
            </div>
          </div>

          <div className="text-center text-xs font-mono text-rose-300 bg-rose-950/40 py-1.5 px-3 rounded-xl border border-rose-500/30">
            "The signal between your device and router is weak, so data transmission becomes unstable."
          </div>
        </div>
      );
    }

    if (issue === 'high-latency') {
      // High Latency: packets moving slowly across wide distance
      const packetPos = (t * 0.18) % 1;
      return (
        <div className="relative w-full h-44 sm:h-52 bg-[#060a17] rounded-2xl border border-amber-500/40 p-4 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_30px_rgba(245,158,11,0.15)]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              DIAGNOSIS: HIGH LATENCY (PING: 480ms)
            </span>
            <span className="text-slate-400">Round Trip Time: Excessive</span>
          </div>

          <div className="relative flex items-center justify-between px-4 sm:px-12 my-auto">
            {/* Device */}
            <div className="flex flex-col items-center gap-1 z-10">
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-cyan-400 flex items-center justify-center text-cyan-300 font-mono text-[10px] font-bold">
                CLIENT
              </div>
              <span className="text-[10px] font-mono text-slate-400">NYC, USA</span>
            </div>

            {/* Long Slow Track */}
            <div className="flex-1 mx-3 relative flex items-center h-8">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-amber-500/30">
                <div className="w-full h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-purple-500 opacity-40" />
              </div>

              {/* Crawling Slow Packet */}
              <div
                className="absolute top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-amber-500 text-black font-mono font-black text-[10px] shadow-[0_0_15px_rgba(245,158,11,0.9)] flex items-center gap-1"
                style={{ left: `${Math.max(5, Math.min(85, packetPos * 100))}%` }}
              >
                <span>🐢 Slow Packet</span>
              </div>
            </div>

            {/* Server */}
            <div className="flex flex-col items-center gap-1 z-10">
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-purple-400 flex items-center justify-center text-purple-300 font-mono text-[10px] font-bold">
                SERVER
              </div>
              <span className="text-[10px] font-mono text-slate-400">Sydney, AUS</span>
            </div>
          </div>

          <div className="text-center text-xs font-mono text-amber-300 bg-amber-950/40 py-1.5 px-3 rounded-xl border border-amber-500/30">
            "Data is taking longer than usual to travel through the network."
          </div>
        </div>
      );
    }

    if (issue === 'packet-loss') {
      // Packet Loss: some packets failing midway and vanishing
      const pos1 = (t * 0.4) % 1;
      const pos2 = ((t * 0.4) + 0.33) % 1;
      const pos3 = ((t * 0.4) + 0.66) % 1;

      return (
        <div className="relative w-full h-44 sm:h-52 bg-[#060a17] rounded-2xl border border-cyan-500/40 p-4 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_30px_rgba(6,182,212,0.15)]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              DIAGNOSIS: PACKET LOSS (25% DROPPED)
            </span>
            <span className="text-slate-400">Stream Buffer: Underrun</span>
          </div>

          <div className="relative flex items-center justify-between px-4 sm:px-12 my-auto">
            {/* Sender */}
            <div className="flex flex-col items-center gap-1 z-10">
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-cyan-400 flex items-center justify-center text-cyan-300 font-mono text-[10px] font-bold">
                SENDER
              </div>
              <span className="text-[10px] font-mono text-slate-400">Audio In</span>
            </div>

            {/* Path with Dropping Zone */}
            <div className="flex-1 mx-3 relative flex items-center h-12">
              <div className="w-full h-1 bg-slate-800 rounded-full border border-cyan-500/30" />

              {/* Packet 1 (Successful) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-emerald-500 text-black font-mono text-[9px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                style={{ left: `${pos1 * 85}%` }}
              >
                Pkt #1 ✓
              </div>

              {/* Packet 2 (Dropping Midway in Red X) */}
              {pos2 < 0.5 ? (
                <div
                  className="absolute top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-cyan-400 text-black font-mono text-[9px] font-bold"
                  style={{ left: `${pos2 * 85}%` }}
                >
                  Pkt #2
                </div>
              ) : (
                <div
                  className="absolute top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-rose-500 text-white font-mono text-[9px] font-black animate-ping"
                  style={{ left: '48%' }}
                >
                  ✖ LOST
                </div>
              )}

              {/* Packet 3 (Successful) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-emerald-500 text-black font-mono text-[9px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                style={{ left: `${pos3 * 85}%` }}
              >
                Pkt #3 ✓
              </div>
            </div>

            {/* Receiver */}
            <div className="flex flex-col items-center gap-1 z-10">
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-purple-400 flex items-center justify-center text-purple-300 font-mono text-[10px] font-bold">
                RECEIVER
              </div>
              <span className="text-[10px] font-mono text-slate-400">Speaker</span>
            </div>
          </div>

          <div className="text-center text-xs font-mono text-cyan-300 bg-cyan-950/40 py-1.5 px-3 rounded-xl border border-cyan-500/30">
            "Some packets do not arrive successfully and may need to be sent again."
          </div>
        </div>
      );
    }

    // Server Congestion: many packets piled up at server gate
    return (
      <div className="relative w-full h-44 sm:h-52 bg-[#060a17] rounded-2xl border border-purple-500/40 p-4 flex flex-col justify-between overflow-hidden shadow-[inset_0_0_30px_rgba(168,85,247,0.15)]">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-purple-400 font-bold flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 animate-pulse" />
            DIAGNOSIS: SERVER CONGESTION (CPU 100% / QUEUE FULL)
          </span>
          <span className="text-slate-400">Queue Depth: 9,840 Waiting</span>
        </div>

        <div className="relative flex items-center justify-between px-4 sm:px-12 my-auto">
          {/* Incoming Clients */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-11 h-11 rounded-xl bg-slate-800 border border-cyan-400 flex items-center justify-center text-cyan-300 font-mono text-[10px] font-bold">
              10K USERS
            </div>
            <span className="text-[10px] font-mono text-slate-400">Traffic Spike</span>
          </div>

          {/* Heavy Packet Queue Piled up near server */}
          <div className="flex-1 mx-3 relative flex items-center justify-end pr-2 h-12">
            <div className="w-full h-1 bg-slate-800 rounded-full border border-purple-500/30 absolute left-0" />

            {/* Packet Congestion Cluster */}
            <div className="flex items-center gap-1 z-10">
              <div className="w-4 h-6 rounded bg-purple-400 text-[8px] font-mono text-black font-bold flex items-center justify-center animate-pulse">#1</div>
              <div className="w-4 h-6 rounded bg-purple-400 text-[8px] font-mono text-black font-bold flex items-center justify-center animate-pulse">#2</div>
              <div className="w-4 h-6 rounded bg-purple-400 text-[8px] font-mono text-black font-bold flex items-center justify-center animate-pulse">#3</div>
              <div className="w-4 h-6 rounded bg-purple-500 text-[8px] font-mono text-black font-bold flex items-center justify-center animate-pulse">#4</div>
              <div className="w-4 h-6 rounded bg-rose-500 text-[8px] font-mono text-white font-bold flex items-center justify-center animate-bounce">⏳</div>
            </div>
          </div>

          {/* Overheated Server */}
          <div className="flex flex-col items-center gap-1 z-10">
            <div className="w-11 h-11 rounded-xl bg-purple-950 border-2 border-purple-500 flex items-center justify-center text-purple-300 font-mono text-[10px] font-bold shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse">
              🔥 SERVER
            </div>
            <span className="text-[10px] font-mono text-rose-400 font-bold">503 Overload</span>
          </div>
        </div>

        <div className="text-center text-xs font-mono text-purple-300 bg-purple-950/40 py-1.5 px-3 rounded-xl border border-purple-500/30">
          "The server is handling many requests, causing delays."
        </div>
      </div>
    );
  };

  return (
    <section
      id="detective"
      className="relative py-16 sm:py-24 px-3 sm:px-6 lg:px-8 border-t border-cyan-500/20 bg-[#060814] overflow-hidden"
      aria-labelledby="detective-section-heading"
    >
      {/* Ambient background glow accents */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[650px] h-96 sm:h-[450px] bg-gradient-to-tr from-cyan-900/15 via-indigo-900/15 to-purple-900/15 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-mono uppercase tracking-wider mb-3 sm:mb-4">
            <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
            <span>Interactive Educational Diagnostic Simulator</span>
          </div>
          <h2
            id="detective-section-heading"
            className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3 sm:mb-4 break-words"
          >
            NETWORK DETECTIVE
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 px-1 leading-relaxed">
            Ever had your video freeze or a game lag? Step into the shoes of a network engineer to diagnose invisible internet bottlenecks visually.
          </p>
        </div>

        {/* Scenario Carousel / Switcher Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-6 font-mono text-xs">
          {SCENARIOS.map((scenario, idx) => {
            const isActive = selectedScenarioIndex === idx;
            return (
              <button
                key={scenario.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedScenarioIndex(idx);
                  setSelectedAnswer(null);
                  setIsAnswerSubmitted(false);
                }}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105'
                    : 'bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                aria-label={`Select Scenario ${idx + 1}: ${scenario.title}`}
              >
                <span className="w-5 h-5 rounded-full bg-black/20 text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span>{scenario.tagline}</span>
              </button>
            );
          })}
        </div>

        {/* Main Detective Investigation Card */}
        <div className="glass-panel p-4 sm:p-7 md:p-8 rounded-3xl border border-cyan-500/30 bg-[#080c1d]/90 shadow-[0_0_50px_rgba(6,182,212,0.15)] space-y-6 sm:space-y-8">
          
          {/* Top Scenario Prompt Card */}
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 border border-cyan-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                  {currentScenario.title}
                </span>
                <span className="text-xs font-mono text-slate-400">Investigate the Clue:</span>
              </div>
              <h3 className="text-base sm:text-xl md:text-2xl font-display font-bold text-white leading-snug">
                {currentScenario.symptom}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResetCurrent}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]"
                aria-label="Reset current scenario investigation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* 4 Interactive Diagnosis Options Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 px-1">
              <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                <Activity className="w-4 h-4" />
                <span>Select the most likely root cause:</span>
              </span>
              <span>Click to test hypothesis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {currentScenario.options.map((option) => {
                const isSelected = selectedAnswer === option.type;
                const isOptionCorrect = option.type === currentScenario.correctIssue;
                
                let cardStyle = 'border-white/10 bg-[#0b1024]/80 hover:bg-[#0e1634] hover:border-cyan-500/40 text-slate-200';
                if (isSelected) {
                  if (isOptionCorrect) {
                    cardStyle = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.3)] ring-2 ring-emerald-500/50';
                  } else {
                    cardStyle = 'border-rose-500/80 bg-rose-950/30 text-rose-200 shadow-[0_0_25px_rgba(244,63,94,0.3)] ring-2 ring-rose-500/50';
                  }
                }

                return (
                  <button
                    key={option.type}
                    onClick={() => handleSelectOption(option.type)}
                    className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group min-h-[90px] flex flex-col justify-between ${cardStyle}`}
                    aria-label={`Option: ${option.label}. ${option.description}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
                          {option.icon}
                        </div>
                        <div>
                          <h4 className="font-mono font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                            {option.label}
                          </h4>
                          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-normal">
                            {option.description}
                          </p>
                        </div>
                      </div>

                      {/* Status indicator icon if selected */}
                      {isSelected && (
                        <div className="shrink-0">
                          {isOptionCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-400 animate-pulse" />
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VISUAL EXPLANATION & OUTCOME SECTION (Appears immediately on selection) */}
          {isAnswerSubmitted && (
            <div className="space-y-5 animate-fade-in pt-2">
              {/* Verdict Header Badge */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                  : 'bg-rose-950/40 border-rose-500/60 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
              }`}>
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-display font-extrabold text-base sm:text-lg text-white">
                      {isCorrect ? '🎯 Accurate Diagnosis!' : '⚠️ Not Quite the Root Cause'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                      {isCorrect
                        ? `You correctly identified ${currentScenario.options.find(o => o.type === currentScenario.correctIssue)?.label} as the bottleneck.`
                        : `Take a look at the animated diagram below to see what ${currentScenario.options.find(o => o.type === currentScenario.correctIssue)?.label} actually looks like.`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleNextScenario}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[40px]"
                >
                  <span>Try Next Scenario</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Visual Simulation of the Problem */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300 px-1">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Visual Demonstration of the Issue:</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Live Network Telemetry Simulator</span>
                </div>

                {renderVisualProblemCanvas(currentScenario.correctIssue)}
              </div>

              {/* Solution & Educational Explanation Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visual Explanation Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                    <Info className="w-4 h-4" />
                    <span>Why This Happens:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    "{currentScenario.explanation.problemStatement}"
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentScenario.explanation.visualDetail}
                  </p>
                </div>

                {/* Practical Solution Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Recommended Solution:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-200 font-bold leading-relaxed">
                    {currentScenario.explanation.solution}
                  </p>
                  <div className="text-[11px] font-mono text-slate-300 pt-1 border-t border-emerald-500/20">
                    <span className="text-emerald-400 font-semibold">Pro Tip: </span>
                    {currentScenario.explanation.tip}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Educational Bottom Highlight Box */}
          <div
            id="network-detective-key-takeaway"
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-purple-950/40 border border-cyan-500/30 flex items-center justify-between gap-4 flex-col sm:flex-row"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                  Detective Insight
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  Diagnosing network issues involves isolating the physical link, transport latency, packet drops, or server processing limits.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleNextScenario}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[40px]"
                aria-label="Next detective scenario"
              >
                <span>Cycle Scenario</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
