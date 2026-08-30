import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NETWORK_STAGES } from '../data/simulationStages';
import { createPacketsFromMessage } from '../utils/packetConverter';
import { soundFx } from '../utils/audio';
import { PacketInspectorModal } from './PacketInspectorModal';
import { PacketXRayModal } from './PacketXRayModal';
import { PacketChunk } from '../types';
import confetti from 'canvas-confetti';
import {
  Send,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Layers,
  Sparkles,
  Zap,
  Clock,
  Radio,
  CheckCircle2,
  Lock,
  Unlock,
  Info,
  Laptop,
  Wifi,
  Globe,
  Server,
  Smartphone,
  MousePointerClick,
  Activity,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface InteractiveSimulationProps {
  isGlobalEncrypted?: boolean;
  reducedMotion?: boolean;
  onAnnounce?: (msg: string) => void;
}

export const InteractiveSimulation: React.FC<InteractiveSimulationProps> = ({
  isGlobalEncrypted = false,
  reducedMotion = false,
  onAnnounce,
}) => {
  // State
  const [message, setMessage] = useState<string>('Hello World');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(isGlobalEncrypted);
  const [stageIndex, setStageIndex] = useState<number>(0); // 0 to 5
  const [subProgress, setSubProgress] = useState<number>(0); // 0 to 1 between nodes
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [nodeArrivalTrigger, setNodeArrivalTrigger] = useState<number | null>(null);
  const [packets, setPackets] = useState<PacketChunk[]>(() =>
    createPacketsFromMessage('Hello World', isGlobalEncrypted)
  );
  const [selectedPacketIndex, setSelectedPacketIndex] = useState<number>(0);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isXRayOpen, setIsXRayOpen] = useState<boolean>(false);
  const [liveLatencyMs, setLiveLatencyMs] = useState<number>(0);

  // Track initial mount for stage announcer
  const isFirstMount = useRef<boolean>(true);

  // Sync external encryption state if provided
  useEffect(() => {
    setIsEncrypted(isGlobalEncrypted);
  }, [isGlobalEncrypted]);

  // Regenerate packets when message or encryption changes
  useEffect(() => {
    const updatedPackets = createPacketsFromMessage(message, isEncrypted);
    setPackets(updatedPackets);
    setSelectedPacketIndex(0);
  }, [message, isEncrypted]);

  // Announce stage changes to screen readers (skipped on first mount)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const stg = NETWORK_STAGES[stageIndex];
    if (stg && onAnnounce) {
      onAnnounce(`Stage ${stg.id}: ${stg.title}. ${stg.shortDesc}`);
    }
  }, [stageIndex, onAnnounce]);

  // Animation sync refs to avoid nested setState calls and render warnings
  const stageIndexRef = useRef<number>(stageIndex);
  const subProgressRef = useRef<number>(subProgress);
  const isPlayingRef = useRef<boolean>(isPlaying);

  useEffect(() => {
    stageIndexRef.current = stageIndex;
  }, [stageIndex]);

  useEffect(() => {
    subProgressRef.current = subProgress;
  }, [subProgress]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Stage Icons Map
  const getStageIcon = (key: string, size: string = 'w-6 h-6') => {
    switch (key) {
      case 'device':
        return <Laptop className={size} aria-hidden="true" />;
      case 'wifi':
        return <Wifi className={size} aria-hidden="true" />;
      case 'isp':
        return <Globe className={size} aria-hidden="true" />;
      case 'backbone':
        return <Zap className={size} aria-hidden="true" />;
      case 'datacenter':
        return <Server className={size} aria-hidden="true" />;
      case 'destination':
        return <Smartphone className={size} aria-hidden="true" />;
      default:
        return <Laptop className={size} aria-hidden="true" />;
    }
  };

  // Trigger visual node arrival feedback
  const triggerNodeArrivalFeedback = (index: number) => {
    setNodeArrivalTrigger(index);
    setTimeout(() => {
      setNodeArrivalTrigger((curr) => (curr === index ? null : curr));
    }, 600);
  };

  // Start sending data from the beginning
  const handleSendData = () => {
    soundFx.playClick();
    soundFx.playLaunch();
    stageIndexRef.current = 0;
    subProgressRef.current = 0;
    isPlayingRef.current = true;
    setStageIndex(0);
    setSubProgress(0);
    setIsCompleted(false);
    setIsPlaying(true);
    triggerNodeArrivalFeedback(0);
    onAnnounce?.(`Data sent! Packaging message into packets at Stage 1: User Device.`);
  };

  // Reset simulation
  const handleReset = () => {
    soundFx.playClick();
    isPlayingRef.current = false;
    stageIndexRef.current = 0;
    subProgressRef.current = 0;
    setIsPlaying(false);
    setStageIndex(0);
    setSubProgress(0);
    setIsCompleted(false);
    setLiveLatencyMs(0);
    setNodeArrivalTrigger(null);
    onAnnounce?.(`Simulation reset to Stage 1.`);
  };

  // Play / Pause toggle
  const handleTogglePlay = () => {
    soundFx.playClick();
    if (isCompleted) {
      handleSendData();
    } else {
      const nextPlaying = !isPlaying;
      isPlayingRef.current = nextPlaying;
      setIsPlaying(nextPlaying);
      onAnnounce?.(nextPlaying ? 'Simulation playing' : 'Simulation paused');
    }
  };

  // Step Forward
  const handleStepForward = useCallback(() => {
    soundFx.playClick();
    if (stageIndex < NETWORK_STAGES.length - 1) {
      const nextIndex = stageIndex + 1;
      stageIndexRef.current = nextIndex;
      subProgressRef.current = 0;
      setStageIndex(nextIndex);
      setSubProgress(0);
      soundFx.playHop(nextIndex);
      triggerNodeArrivalFeedback(nextIndex);
      if (nextIndex === NETWORK_STAGES.length - 1) {
        setIsCompleted(true);
        soundFx.playArrival();
      }
    }
  }, [stageIndex]);

  // Step Backward
  const handleStepBack = () => {
    soundFx.playClick();
    if (stageIndex > 0) {
      const prevIndex = stageIndex - 1;
      stageIndexRef.current = prevIndex;
      subProgressRef.current = 0;
      setStageIndex(prevIndex);
      setSubProgress(0);
      setIsCompleted(false);
      soundFx.playHop(prevIndex);
      triggerNodeArrivalFeedback(prevIndex);
    }
  };

  // Main animation timer loop
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current != null) {
        const delta = time - lastTimeRef.current;
        // Base time per node segment: 1500ms at 1x speed (faster if reduced motion)
        const segmentDuration = (reducedMotion ? 800 : 1500) / speedMultiplier;
        const currentSub = subProgressRef.current;
        const currentStage = stageIndexRef.current;
        const nextSub = currentSub + delta / segmentDuration;

        if (nextSub >= 1) {
          const nextStage = currentStage + 1;
          if (nextStage >= NETWORK_STAGES.length) {
            // Completed journey!
            isPlayingRef.current = false;
            setIsPlaying(false);
            setIsCompleted(true);
            setSubProgress(0);
            subProgressRef.current = 0;
            soundFx.playArrival();
            triggerNodeArrivalFeedback(NETWORK_STAGES.length - 1);
            onAnnounce?.('Data packet journey completed! Message arrived at Destination.');

            if (!reducedMotion) {
              try {
                confetti({
                  particleCount: 50,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#06b6d4', '#a855f7', '#3b82f6', '#10b981'],
                });
              } catch {
                // Ignore
              }
            }
            return;
          } else {
            // Advance to next stage cleanly
            stageIndexRef.current = nextStage;
            subProgressRef.current = 0;
            setStageIndex(nextStage);
            setSubProgress(0);
            soundFx.playHop(nextStage);
            triggerNodeArrivalFeedback(nextStage);
          }
        } else {
          subProgressRef.current = nextSub;
          setSubProgress(nextSub);
        }

        // Calculate simulated latency accumulation
        const currentTotal = stageIndexRef.current + subProgressRef.current;
        setLiveLatencyMs(Math.round(currentTotal * 16.2));
      }

      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speedMultiplier, reducedMotion, onAnnounce]);

  // Overall journey percentage
  const totalPercentage = Math.min(
    100,
    Math.round(((stageIndex + subProgress) / (NETWORK_STAGES.length - 1)) * 100)
  );

  const currentStage = NETWORK_STAGES[stageIndex];
  const activePacket = packets[selectedPacketIndex] || packets[0];

  const presets = [
    'Hello World',
    'Streaming 4K Video 🎬',
    'Sending Cat Photo 🐱',
    'Searching Google 🔍',
    'Secret Password 🔑',
  ];

  return (
    <section
      id="simulation"
      className="relative py-14 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16 sm:scroll-mt-20 w-full"
      aria-label="Interactive Internet Data Journey Simulation"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-mono uppercase tracking-wider mb-3 sm:mb-4">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" aria-hidden="true" />
          <span>Visualizing the Invisible: 6-Stage Packet Journey</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3 sm:mb-4 break-words">
          The 6-Stage Journey of Internet Data
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-300 px-1 leading-relaxed">
          Type any message and click <strong className="text-cyan-300 font-bold">SEND DATA</strong> to watch it convert into glowing digital packets and travel step-by-step through physical network infrastructure.
        </p>
      </div>

      {/* Control Deck & Message Input Bar */}
      <div className="glass-panel p-4 sm:p-6 lg:p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] mb-8 sm:mb-10">
        {/* Step-by-Step Onboarding Ribbon */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 p-3 rounded-2xl bg-[#090e20] border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold">
            <MousePointerClick className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>How To Use:</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[11px] flex-wrap">
            <span>1. Type your text</span>
            <span className="text-cyan-400">➔</span>
            <span>2. Click <strong className="text-white font-bold">SEND DATA</strong></span>
            <span className="text-cyan-400">➔</span>
            <span>3. Follow packet hops</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-3 sm:gap-4">
          {/* Input field */}
          <div className="relative flex-1">
            <label htmlFor="user-message-input" className="sr-only">
              Type your message to send across the internet
            </label>
            <input
              id="user-message-input"
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setIsCompleted(false);
              }}
              maxLength={60}
              placeholder="Type a message (e.g. Hello World)..."
              className="w-full bg-[#0b0f1d] text-white px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border border-white/15 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none text-sm sm:text-base lg:text-lg font-mono placeholder:text-slate-500 transition-all shadow-inner"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] sm:text-xs font-mono text-slate-500">
              {message.length}/60
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            {/* Primary Send Button */}
            <button
              id="send-data-btn"
              onClick={handleSendData}
              className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] transition-all active:scale-95 cursor-pointer border border-cyan-300/30 min-h-[48px]"
              title="Click to package your message into packets and transmit"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200" />
              <span>SEND DATA</span>
            </button>

            {/* Encryption toggle */}
            <button
              id="toggle-sim-encryption-btn"
              onClick={() => {
                soundFx.playClick();
                soundFx.playEncrypt();
                setIsEncrypted(!isEncrypted);
              }}
              className={`px-4 py-3 sm:py-4 rounded-2xl border font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[48px] ${
                isEncrypted
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-500/30'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Toggle TLS 1.3 / HTTPS Encryption"
              aria-label={isEncrypted ? 'Encryption Active' : 'Plaintext Mode'}
            >
              {isEncrypted ? (
                <>
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">TLS ENCRYPTED</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>PLAINTEXT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preset message pills */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 pt-3 border-t border-white/5">
          <span className="text-[11px] sm:text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" /> Presets:
          </span>
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                soundFx.playClick();
                setMessage(preset);
                setIsCompleted(false);
              }}
              className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono bg-white/5 hover:bg-cyan-500/15 text-slate-300 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer active:scale-95"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Live Simulation Controls Bar */}
        <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              id="sim-play-pause-btn"
              onClick={handleTogglePlay}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border flex items-center gap-2 text-xs font-mono font-semibold transition-all cursor-pointer min-h-[40px] ${
                isPlaying
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30'
              }`}
              aria-label={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              <span>{isPlaying ? 'Pause' : isCompleted ? 'Replay' : 'Resume'}</span>
            </button>

            <button
              id="sim-step-back-btn"
              onClick={handleStepBack}
              disabled={stageIndex === 0 && subProgress === 0}
              className="p-2 sm:p-2.5 min-h-[40px] min-w-[40px] rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center"
              title="Previous Node Stage"
              aria-label="Step backward to previous stage"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              id="sim-step-fwd-btn"
              onClick={handleStepForward}
              disabled={stageIndex === NETWORK_STAGES.length - 1}
              className="p-2 sm:p-2.5 min-h-[40px] min-w-[40px] rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center justify-center"
              title="Next Node Stage"
              aria-label="Step forward to next stage"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              id="sim-reset-btn"
              onClick={handleReset}
              className="p-2 sm:p-2.5 min-h-[40px] min-w-[40px] rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center justify-center"
              title="Reset to Stage 1"
              aria-label="Reset simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
            {/* Speed Selector */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-[#0b0f1d] p-1 rounded-xl border border-white/10">
              <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 px-1.5">Speed:</span>
              {[0.5, 1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    soundFx.playClick();
                    setSpeedMultiplier(spd);
                  }}
                  className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs font-mono transition-all cursor-pointer ${
                    speedMultiplier === spd
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  aria-label={`Set speed to ${spd}x`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Packet X-Ray Trigger (Prompt Specified Feature) */}
            <button
              id="open-packet-xray-btn"
              onClick={() => {
                soundFx.playClick();
                setIsXRayOpen(true);
              }}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/50 text-cyan-300 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[40px] shadow-[0_0_15px_rgba(6,182,212,0.25)]"
              title="Open Packet X-Ray: View exploded layers of Header, Source, Destination, Protocol, Payload, and MTU Size"
              aria-label="Inspect data packet inside Packet X-Ray"
            >
              <span className="text-sm">🔬</span>
              <span>Inspect Data Packet</span>
            </button>

            {/* Packet Inspector Trigger */}
            <button
              id="open-packet-inspector-btn"
              onClick={() => {
                soundFx.playClick();
                setIsInspectorOpen(true);
              }}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl glass-panel-glow text-cyan-300 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer min-h-[40px]"
              title="Inspect binary payload, hex dump, and IP headers"
            >
              <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Inspect Packet</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar & Live Telemetry */}
        <div className="mt-5 sm:mt-6 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
              Journey Progress: <strong className="text-cyan-300">{totalPercentage}%</strong>
            </span>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                Est. Latency: <strong className="text-white">{liveLatencyMs} ms</strong>
                <span className="text-[10px] text-cyan-400/80 font-mono">(Simulated)</span>
              </span>
              <span className="text-slate-500">|</span>
              <span>
                Step <strong className="text-cyan-300">{stageIndex + 1}</strong> of 6
              </span>
            </div>
          </div>

          <div className="relative h-2.5 sm:h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10 p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-150 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
              style={{ width: `${totalPercentage}%` }}
              role="progressbar"
              aria-label="Simulation stage progress"
              aria-valuenow={totalPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* Live Glowing Packet Transit Conduit Visualizer */}
      <div className="mb-6 sm:mb-8 glass-panel p-3.5 sm:p-5 rounded-3xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" aria-hidden="true" />
            <span className="font-bold uppercase tracking-wider">Physical Data Transit Medium</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-300 flex-wrap">
            <span>Medium: <strong className="text-cyan-300">{currentStage.hardware}</strong></span>
            <span>Speed: <strong className="text-emerald-400">{currentStage.speed}</strong></span>
          </div>
        </div>

        {/* Live Animation Activity Explanation Banner */}
        <div className="mt-3 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm">
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono">
            {stageIndex + 1}
          </span>
          <div className="min-w-0">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-cyan-400 font-bold block mb-0.5">
              Live Network Activity:
            </span>
            <p className="text-slate-100 font-medium leading-relaxed">
              {stageIndex === 0 && `Splitting "${message}" into numbered digital packets and encoding text into binary 1s and 0s.`}
              {stageIndex === 1 && `Your Wi-Fi radio broadcasts modulated electromagnetic frequencies across the room to your router.`}
              {stageIndex === 2 && `Local router assigns source IP, manages NAT routing, and delivers packets to your ISP gateway.`}
              {stageIndex === 3 && `Laser diodes pulse optical light signals across subsea glass fiber cables under the ocean floor.`}
              {stageIndex === 4 && `Data center edge routers & hardware firewalls inspect packet headers and filter threats.`}
              {stageIndex === 5 && `Remote destination server reassembles all received packets in sequence and delivers "${message}"!`}
            </p>
          </div>
        </div>

        {/* Animated Moving Packet Track */}
        <div className="relative mt-4 py-5 px-3 sm:px-6 bg-[#080d1e] rounded-2xl border border-white/10 overflow-hidden">
          {/* Signal wave background */}
          <div
            className="absolute inset-0 opacity-15 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px]"
            aria-hidden="true"
          />

          {/* Wire / Fiber Channel Track */}
          <div className="relative h-4 bg-slate-900/90 rounded-full border border-cyan-500/20 overflow-hidden" aria-hidden="true">
            {/* Pulsing signal glow across wire */}
            <div
              className="h-full bg-gradient-to-r from-cyan-500/40 via-purple-500/50 to-pink-500/40 rounded-full transition-all duration-100 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
              style={{ width: `${Math.max(5, (subProgress * 100))}%` }}
            />
          </div>

          {/* Real-time Glowing Traveling Packet Badge */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 ease-linear pointer-events-none z-20"
            style={{
              left: `calc(1rem + ${Math.min(90, Math.max(0, subProgress * 86))}% - 32px)`,
            }}
            aria-hidden="true"
          >
            <div className="flex flex-col items-center">
              {/* Outer Packet Glow Aura */}
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl blur-md opacity-75 animate-pulse" />
                <div className="relative px-3 py-1.5 rounded-xl bg-[#0e1630] border border-cyan-300 text-white font-mono text-[10px] sm:text-xs font-bold shadow-[0_0_25px_rgba(6,182,212,1)] flex items-center gap-1.5 whitespace-nowrap">
                  <Zap className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300 animate-bounce" />
                  <span>PKT #{activePacket.id} [{isEncrypted ? '🔒 CIPHER' : 'TEXT'}]</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-cyan-300 bg-slate-950/90 px-1.5 py-0.5 rounded mt-1 border border-cyan-500/40 shadow">
                {activePacket.binaryPayload.slice(0, 10)}...
              </span>
            </div>
          </div>

          {/* Waypoint Nodes: Current Node to Next Node */}
          <div className="flex items-center justify-between pt-6 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,1)] animate-ping" aria-hidden="true" />
              <span className="font-bold text-white">STEP {currentStage.id}: {currentStage.title}</span>
            </div>
            <div className="flex items-center gap-2 text-right">
              <span className="text-slate-300 font-medium">
                {stageIndex < NETWORK_STAGES.length - 1
                  ? `Next: STEP ${stageIndex + 2} (${NETWORK_STAGES[stageIndex + 1].title})`
                  : 'Destination Arrived! 🎉'}
              </span>
              <span className={`w-3 h-3 rounded-full ${stageIndex === NETWORK_STAGES.length - 1 ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-purple-400'}`} aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* 6-Stage Step-by-Step Visual Pipeline */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Stage Map: (Click any step to inspect)</span>
          </span>
          <span className="hidden sm:inline text-cyan-400">
            {stageIndex === 5 ? 'Completed' : `Step ${stageIndex + 1} of 6 active`}
          </span>
        </div>

        {/* Desktop Pipeline (Horizontal Grid / Flow) */}
        <div className="hidden lg:grid grid-cols-6 gap-3 relative" role="region" aria-label="Interactive 6 Stages">
          {/* Animated Connecting Pathway Line */}
          <div
            className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1.5 bg-slate-800/80 -z-0 rounded-full overflow-hidden"
            aria-hidden="true"
          >
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 transition-all duration-150 shadow-[0_0_15px_rgba(6,182,212,1)]"
              style={{ width: `${totalPercentage}%` }}
            />
          </div>

          {NETWORK_STAGES.map((stg, idx) => {
            const isCurrent = stageIndex === idx;
            const isPassed = stageIndex > idx;
            const isArrivalTarget = nodeArrivalTrigger === idx;

            return (
              <button
                key={stg.id}
                id={`stage-node-${stg.key}`}
                onClick={() => {
                  soundFx.playClick();
                  soundFx.playHop(idx);
                  setStageIndex(idx);
                  setSubProgress(0);
                  triggerNodeArrivalFeedback(idx);
                  if (idx === NETWORK_STAGES.length - 1) {
                    setIsCompleted(true);
                  }
                }}
                className={`relative z-10 flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer ${
                  isCurrent
                    ? 'glass-panel-glow border-cyan-400 scale-105 shadow-[0_0_35px_rgba(6,182,212,0.4)]'
                    : isPassed
                    ? 'glass-panel border-emerald-500/30 opacity-90 hover:opacity-100'
                    : 'glass-panel border-white/5 opacity-55 hover:opacity-90'
                } ${isArrivalTarget ? 'ring-4 ring-cyan-400/80 scale-110' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Jump to Stage ${stg.id}: ${stg.title}. ${isCurrent ? 'Current stage' : isPassed ? 'Completed stage' : 'Upcoming stage'}`}
              >
                {/* Node Number Badge */}
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-all ${
                    isCurrent
                      ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  STEP {stg.id}
                </span>

                {/* Stage Icon Circle */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mt-1 text-2xl transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.7)] animate-pulse'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {getStageIcon(stg.key, 'w-7 h-7')}
                </div>

                <div className="font-display font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {stg.title}
                </div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5 line-clamp-1">
                  {stg.subtitle}
                </div>

                {/* Status indicator */}
                {isCurrent && (
                  <div className="mt-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" aria-hidden="true" />
                    <span>Active Node</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile / Tablet Vertical Flow */}
        <div className="lg:hidden space-y-2.5 sm:space-y-3">
          {NETWORK_STAGES.map((stg, idx) => {
            const isCurrent = stageIndex === idx;
            const isPassed = stageIndex > idx;
            const isArrivalTarget = nodeArrivalTrigger === idx;

            return (
              <div key={stg.id} className="relative">
                <button
                  id={`mobile-stage-node-${stg.key}`}
                  onClick={() => {
                    soundFx.playClick();
                    soundFx.playHop(idx);
                    setStageIndex(idx);
                    setSubProgress(0);
                    triggerNodeArrivalFeedback(idx);
                  }}
                  className={`w-full p-3.5 sm:p-4 rounded-2xl flex items-center gap-3 sm:gap-4 transition-all text-left cursor-pointer min-h-[64px] active:scale-[0.99] ${
                    isCurrent
                      ? 'glass-panel-glow border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                      : isPassed
                      ? 'glass-panel border-emerald-500/30 opacity-90'
                      : 'glass-panel border-white/5 opacity-60'
                  } ${isArrivalTarget ? 'ring-2 ring-cyan-400' : ''}`}
                  aria-label={`Jump to Stage ${stg.id}: ${stg.title}. ${isCurrent ? 'Current stage' : isPassed ? 'Completed stage' : 'Upcoming stage'}`}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {getStageIcon(stg.key, 'w-5 h-5 sm:w-6 sm:h-6')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded bg-white/5 text-cyan-400">
                        STEP {stg.id}
                      </span>
                      <h4 className="font-display font-bold text-xs sm:text-sm text-white truncate">
                        {stg.title}
                      </h4>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 line-clamp-1 sm:line-clamp-2">{stg.shortDesc}</p>
                  </div>

                  {isPassed && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" aria-label="Completed" />}
                  {isCurrent && (
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-cyan-400 animate-ping shrink-0" aria-label="Active" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detailed Spotlight Card */}
      <div
        id="active-stage-spotlight"
        className="glass-panel p-4 sm:p-6 lg:p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden"
      >
        {/* Background glow accent */}
        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: currentStage.glowColor }}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-white/10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${currentStage.color} shadow-[0_0_30px_rgba(6,182,212,0.6)] shrink-0`}
            >
              {getStageIcon(currentStage.key, 'w-6 h-6 sm:w-8 sm:h-8')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  STEP {currentStage.id} OF 6
                </span>
                <span className="text-[11px] sm:text-xs font-mono text-slate-400">{currentStage.subtitle}</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-extrabold text-white mt-1 break-words">
                {currentStage.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsInspectorOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[40px]"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Inspect Packet Bits</span>
            </button>
          </div>
        </div>

        {/* Primary Explanation Card */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main student explanation */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {/* Core Highlighted Explanation Quote */}
            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold block mb-1">
                📌 Key Explanation:
              </span>
              <p className="text-base sm:text-xl font-display font-bold text-white leading-relaxed">
                "{currentStage.shortDesc}"
              </p>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
              {currentStage.fullDesc}
            </p>

            {/* Real World Analogy Box */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-3">
              <span className="text-lg sm:text-xl shrink-0">💡</span>
              <div>
                <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-purple-300 font-bold block mb-0.5 sm:mb-1">
                  Real-World Student Analogy:
                </span>
                <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed italic">
                  "{currentStage.analogy}"
                </p>
              </div>
            </div>
          </div>

          {/* Technical Telemetry & Protocols */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0b0f1d] border border-white/10 space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2 text-slate-400 font-semibold pb-2 border-b border-white/5">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Stage Specifications</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">KEY PROTOCOL</span>
                <span className="text-cyan-300 font-semibold text-xs">{currentStage.protocol}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">PHYSICAL HARDWARE</span>
                <span className="text-slate-200">{currentStage.hardware}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">PHYSICAL VELOCITY</span>
                <span className="text-emerald-400 font-semibold">{currentStage.speed}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">DATA TRANSFORMATION</span>
                <span className="text-purple-300 text-[11px] block mt-0.5 leading-snug">
                  {currentStage.packetTransform}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Packet Transformation preview bar */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 max-w-full">
            <span className="text-slate-400 shrink-0">Current Payload:</span>
            <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-black/60 text-cyan-300 border border-white/10 font-bold truncate max-w-[180px] sm:max-w-none">
              "{activePacket.textPayload}"
            </span>
          </div>

          <div className="flex items-center gap-2 max-w-full">
            <span className="text-slate-400 shrink-0">Binary Bitstream:</span>
            <span className="px-2.5 sm:px-3 py-1 rounded-lg bg-black/60 text-emerald-400 border border-white/10 max-w-[200px] sm:max-w-[260px] truncate break-all">
              {activePacket.binaryPayload}
            </span>
          </div>
        </div>

        {/* PACKET X-RAY Interactive Card */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0b1024] via-[#0e1634] to-[#120f2e] border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0">
              <Layers className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  Feature: Packet X-Ray
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  6 Exploded Layers
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-display font-bold text-white mt-0.5">
                Peek Inside Your Message's Structured Packet
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                See how Header, Source, Destination, Protocol, Payload, and MTU Size organize your data.
              </p>
            </div>
          </div>

          <button
            id="sim-packet-xray-card-btn"
            onClick={() => {
              soundFx.playClick();
              setIsXRayOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all cursor-pointer inline-flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shrink-0 min-h-[44px]"
            aria-label="Inspect Data Packet inside Packet X-Ray"
          >
            <span className="text-sm">🔬</span>
            <span>Inspect Data Packet</span>
          </button>
        </div>

        {/* First-Time User Key Takeaways Box (Always visible at Step 6 or on completion) */}
        {stageIndex === 5 && (
          <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-purple-950/40 border border-emerald-500/40 shadow-lg animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm sm:text-base font-display mb-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>🎉 Congratulations! What You Just Discovered:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-3 text-xs text-slate-200">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="block font-bold text-cyan-300 mb-1">1. Sliced into Packets</span>
                <p className="text-[11px] text-slate-300">Data never travels as one huge file. It is broken into small, numbered packets so missing bits can be resent.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="block font-bold text-cyan-300 mb-1">2. Light Across Oceans</span>
                <p className="text-[11px] text-slate-300">99% of global internet relies on real physical fiber-optic glass cables laid on ocean sea floors, not satellites.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                <span className="block font-bold text-cyan-300 mb-1">3. Reassembled Instantly</span>
                <p className="text-[11px] text-slate-300">Destination servers check packet checksums and reorder them seamlessly in a few milliseconds.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Deep Packet Inspector Modal */}
      <PacketInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        packet={activePacket}
        currentStage={currentStage}
        isEncrypted={isEncrypted}
      />

      {/* PACKET X-RAY Modal */}
      <PacketXRayModal
        isOpen={isXRayOpen}
        onClose={() => setIsXRayOpen(false)}
        initialMessage={message}
        isEncrypted={isEncrypted}
        reducedMotion={reducedMotion}
        onAnnounce={onAnnounce}
      />
    </section>
  );
};

