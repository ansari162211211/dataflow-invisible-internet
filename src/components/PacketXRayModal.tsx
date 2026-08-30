import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  RotateCcw,
  Sparkles,
  Layers,
  Binary,
  Radio,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Server,
  Laptop,
  CheckCircle2,
  Lock,
  Eye,
  FileCode,
  Sliders
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface PacketXRayModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  isEncrypted?: boolean;
  reducedMotion?: boolean;
  onAnnounce?: (msg: string) => void;
}

export type XRayLayerKey = 'header' | 'source' | 'destination' | 'protocol' | 'payload' | 'size';

interface LayerInfo {
  key: XRayLayerKey;
  number: number;
  name: string;
  badge: string;
  color: string;
  borderGlow: string;
  bgActive: string;
  icon: React.ReactNode;
  summary: string;
  simpleExplanation: string;
  technicalDetails: {
    label: string;
    value: string;
  }[];
  analogy: string;
}

export const PacketXRayModal: React.FC<PacketXRayModalProps> = ({
  isOpen,
  onClose,
  initialMessage = 'HELLO',
  isEncrypted = true,
  reducedMotion = false,
  onAnnounce,
}) => {
  const [customText, setCustomText] = useState<string>(initialMessage || 'HELLO');
  const [activeLayer, setActiveLayer] = useState<XRayLayerKey>('payload');
  // Animation flow phase: 0 = Plain Text, 1 = Binary Bits, 2 = Sealed Packet Container, 3 = Exploded X-Ray
  const [animPhase, setAnimPhase] = useState<number>(3);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sync initial message
  useEffect(() => {
    if (initialMessage) {
      setCustomText(initialMessage);
    }
  }, [initialMessage]);

  // Compute binary representation
  const binaryString = useMemo(() => {
    const text = customText || 'HELLO';
    return text
      .split('')
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
  }, [customText]);

  // Compute Hex representation
  const hexString = useMemo(() => {
    const text = customText || 'HELLO';
    return text
      .split('')
      .map((char) => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');
  }, [customText]);

  // Compute Checksum
  const checksumHex = useMemo(() => {
    let sum = 0;
    const text = customText || 'HELLO';
    for (let i = 0; i < text.length; i++) {
      sum = (sum + text.charCodeAt(i) * (i + 1)) % 65535;
    }
    return '0x' + sum.toString(16).toUpperCase().padStart(4, '0');
  }, [customText]);

  // Layer details definitions based on hackathon educational specifications
  const LAYERS: LayerInfo[] = [
    {
      key: 'header',
      number: 1,
      name: 'HEADER',
      badge: 'Control Metadata',
      color: 'text-cyan-400',
      borderGlow: 'border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.35)]',
      bgActive: 'bg-cyan-500/15 text-cyan-200',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      summary: 'Controls information about the packet.',
      simpleExplanation: 'Controls information that directs, numbers, and validates the packet across network hops.',
      analogy: 'Like the shipping label and tracking barcode stamped on the outside of a cardboard postal box.',
      technicalDetails: [
        { label: 'IP Version', value: 'IPv4 (Internet Protocol v4)' },
        { label: 'Time To Live (TTL)', value: '64 Hops Max' },
        { label: 'Sequence Number', value: 'Seq #1042 (Packet 1 of 1)' },
        { label: 'Header Checksum', value: checksumHex },
      ],
    },
    {
      key: 'source',
      number: 2,
      name: 'SOURCE',
      badge: 'Origin Address',
      color: 'text-emerald-400',
      borderGlow: 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.35)]',
      bgActive: 'bg-emerald-500/15 text-emerald-200',
      icon: <Laptop className="w-5 h-5 text-emerald-400" />,
      summary: 'Your Device',
      simpleExplanation: 'This tells the network where the data packet started.',
      analogy: 'Like the sender return address on an envelope so the receiver knows who wrote it.',
      technicalDetails: [
        { label: 'Source Device', value: 'Your Laptop / Smartphone' },
        { label: 'Source IP', value: '192.168.1.45 (Local Subnet)' },
        { label: 'Source Port', value: '54321 (Ephemeral Client Port)' },
        { label: 'MAC Address', value: '3C:22:FB:9E:04:1A' },
      ],
    },
    {
      key: 'destination',
      number: 3,
      name: 'DESTINATION',
      badge: 'Target Address',
      color: 'text-purple-400',
      borderGlow: 'border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.35)]',
      bgActive: 'bg-purple-500/15 text-purple-200',
      icon: <Server className="w-5 h-5 text-purple-400" />,
      summary: 'Example Server',
      simpleExplanation: 'This helps routers know where the packet should go.',
      analogy: 'Like the delivery address on mail that postal sorting centers read to route items across cities.',
      technicalDetails: [
        { label: 'Destination', value: 'Example Cloud Server' },
        { label: 'Destination IP', value: '142.250.190.46 (Public IPv4)' },
        { label: 'Target Port', value: '443 (Standard Secure HTTPS)' },
        { label: 'Target Host', value: 'api.example.com' },
      ],
    },
    {
      key: 'protocol',
      number: 4,
      name: 'PROTOCOL',
      badge: 'Communication Rules',
      color: 'text-amber-400',
      borderGlow: 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      bgActive: 'bg-amber-500/15 text-amber-200',
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      summary: 'HTTPS / TCP',
      simpleExplanation: 'Protocols are rules that help devices communicate correctly.',
      analogy: 'Like speaking a mutually understood language and agreeing on politeness rules before having a conversation.',
      technicalDetails: [
        { label: 'Transport Layer', value: 'TCP (Guaranteed in-order delivery)' },
        { label: 'Application Layer', value: 'HTTPS (HyperText Transfer Protocol Secure)' },
        { label: 'Encryption Standard', value: isEncrypted ? 'TLS 1.3 (AES-256-GCM)' : 'Plaintext (HTTP)' },
        { label: 'Handshake Status', value: 'SYN-ACK Established' },
      ],
    },
    {
      key: 'payload',
      number: 5,
      name: 'PAYLOAD',
      badge: 'Message Cargo',
      color: 'text-blue-400',
      borderGlow: 'border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.35)]',
      bgActive: 'bg-blue-500/15 text-blue-200',
      icon: <Layers className="w-5 h-5 text-blue-400" />,
      summary: "The user's message or simulated data",
      simpleExplanation: 'This contains the actual information being transported.',
      analogy: 'Like the letter or gift placed securely inside the postal parcel.',
      technicalDetails: [
        { label: 'Raw Text', value: `"${customText || 'HELLO'}"` },
        { label: 'Binary Form', value: binaryString.slice(0, 35) + '...' },
        { label: 'Hex Form', value: hexString },
        { label: 'Encrypted Payload', value: isEncrypted ? '🔒 [Encrypted Ciphertext Bits]' : '🔓 [Plaintext Readable]' },
      ],
    },
    {
      key: 'size',
      number: 6,
      name: 'PACKET SIZE',
      badge: 'MTU Capacity Limit',
      color: 'text-pink-400',
      borderGlow: 'border-pink-500/60 shadow-[0_0_20px_rgba(236,72,153,0.35)]',
      bgActive: 'bg-pink-500/15 text-pink-200',
      icon: <FileCode className="w-5 h-5 text-pink-400" />,
      summary: 'Example: 1,500 bytes',
      simpleExplanation: 'Data is split into standard chunks (typically up to 1,500 bytes) so networks do not get clogged.',
      analogy: 'Like packing cargo into standardized shipping containers instead of one massive unmovable block.',
      technicalDetails: [
        { label: 'Standard MTU', value: '1,500 Bytes (Ethernet Maximum)' },
        { label: 'Current Payload', value: `${(customText || 'HELLO').length} Bytes` },
        { label: 'Header Overhead', value: '40 Bytes (20B IP + 20B TCP)' },
        { label: 'Total Packet Frame', value: `${40 + (customText || 'HELLO').length} Bytes` },
      ],
    },
  ];

  // Selected layer reference
  const currentLayerInfo = useMemo(() => {
    return LAYERS.find((l) => l.key === activeLayer) || LAYERS[0];
  }, [activeLayer, LAYERS]);

  // Escape key handler and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundFx.playClick();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, onClose]);

  // Auto-play 4-step sequence
  const startSequence = () => {
    soundFx.playClick();
    soundFx.playLaunch();
    setIsAutoPlaying(true);
    setAnimPhase(0);
    onAnnounce?.('Step 1: Normal message text.');

    if (reducedMotion) {
      setAnimPhase(3);
      setIsAutoPlaying(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      soundFx.playHop(2);
      setAnimPhase(1);
      onAnnounce?.('Step 2: Message converted into binary data bits.');

      timerRef.current = setTimeout(() => {
        soundFx.playHop(4);
        setAnimPhase(2);
        onAnnounce?.('Step 3: Data encapsulated into structured packet container.');

        timerRef.current = setTimeout(() => {
          soundFx.playArrival();
          setAnimPhase(3);
          setIsAutoPlaying(false);
          onAnnounce?.('Step 4: Packet X-Ray exploded layers revealed!');
        }, 1600);
      }, 1600);
    }, 1400);
  };

  const handleSelectLayer = (key: XRayLayerKey) => {
    soundFx.playClick();
    setActiveLayer(key);
    const layer = LAYERS.find((l) => l.key === key);
    if (layer) {
      onAnnounce?.(`Inspecting ${layer.name}: ${layer.simpleExplanation}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="packet-xray-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="packet-xray-title"
    >
      <div
        id="packet-xray-card"
        className="relative w-full max-w-5xl bg-[#080d1e] border border-cyan-500/40 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.3)] overflow-hidden my-auto max-h-[94vh] flex flex-col"
      >
        {/* Top Header Banner */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-gradient-to-r from-cyan-950/60 via-indigo-950/40 to-purple-950/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.4)] shrink-0" aria-hidden="true">
              <Eye className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 id="packet-xray-title" className="font-display text-base sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>PACKET X-RAY</span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    🔬 Deep Structure Scanner
                  </span>
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 font-mono flex items-center gap-1.5 mt-0.5">
                <span>Visualizing the invisible interior of an internet data packet</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              ref={closeButtonRef}
              id="close-packet-xray-btn"
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Close Packet X-Ray view"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">
          
          {/* Quick Message Customizer & Animation Sequence Toolbar */}
          <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto flex-1 min-w-0">
              <span className="text-xs font-mono text-cyan-300 font-bold whitespace-nowrap">
                Custom Message:
              </span>
              <input
                id="xray-custom-text-input"
                type="text"
                maxLength={20}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type any word..."
                className="w-full max-w-xs px-3 py-1.5 rounded-xl bg-black/60 border border-cyan-500/30 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                aria-label="Custom message to inspect in packet x-ray"
              />
            </div>

            {/* Sequence Flow Phase Indicators & Replay Button */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-wrap">
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                <span className="hidden sm:inline">Sequence:</span>
                {[
                  { phase: 0, label: '1. Text' },
                  { phase: 1, label: '2. Binary' },
                  { phase: 2, label: '3. Sealed' },
                  { phase: 3, label: '4. X-Ray' },
                ].map((s) => (
                  <button
                    key={s.phase}
                    onClick={() => {
                      soundFx.playClick();
                      setAnimPhase(s.phase);
                    }}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      animPhase === s.phase
                        ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                        : 'bg-black/40 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                    aria-label={`Jump to sequence phase ${s.label}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                id="replay-xray-anim-btn"
                onClick={startSequence}
                disabled={isAutoPlaying}
                className="px-3.5 py-1.5 min-h-[38px] rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                aria-label="Replay transformation animation sequence"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isAutoPlaying ? 'animate-spin' : ''}`} />
                <span>Replay Animation</span>
              </button>
            </div>
          </div>

          {/* SEQUENCE STEP ANIMATION VIEWERS */}

          {/* Phase 0: Normal Message View */}
          {animPhase === 0 && (
            <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0e1630] to-[#090e20] border border-cyan-500/30 text-center space-y-4 animate-fade-in shadow-2xl">
              <span className="inline-block text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                Step 1 of 4 • Human Readable Text
              </span>
              <h4 className="text-2xl sm:text-4xl font-mono font-extrabold text-white tracking-widest break-all">
                "{customText || 'HELLO'}"
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Before sending, your message exists as normal human language characters. Next, your device converts these characters into electrical/optical binary code.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    soundFx.playHop(2);
                    setAnimPhase(1);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Next: Convert to Binary (1s & 0s)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Phase 1: Binary Bitstream Conversion View */}
          {animPhase === 1 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0e1630] to-[#090e20] border border-cyan-500/30 text-center space-y-4 animate-fade-in shadow-2xl">
              <span className="inline-block text-xs font-mono text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                Step 2 of 4 • Binary Digital Encoding (UTF-8 8-bit)
              </span>
              <div className="p-4 sm:p-6 rounded-2xl bg-black/70 border border-emerald-500/40 font-mono text-sm sm:text-lg text-emerald-400 tracking-wider break-all shadow-[inset_0_0_20px_rgba(16,185,129,0.15)] leading-relaxed font-bold">
                {binaryString}
              </div>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Computers do not transmit letters directly. Every letter is converted into 8 binary bits (1s and 0s). For example, <strong>'H'</strong> is <code className="text-cyan-300">01001000</code>.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    soundFx.playHop(3);
                    setAnimPhase(2);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold font-mono text-xs shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Next: Encapsulate into Packet Box</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Phase 2: Sealed Packet Container Box */}
          {animPhase === 2 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0e1630] to-[#090e20] border border-cyan-500/30 text-center space-y-5 animate-fade-in shadow-2xl">
              <span className="inline-block text-xs font-mono text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30">
                Step 3 of 4 • Standard Encapsulated Packet Container
              </span>

              {/* Glowing Sealed Box Representation */}
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#090d1f] border-2 border-cyan-500/60 shadow-[0_0_35px_rgba(6,182,212,0.35)] relative group cursor-pointer hover:border-cyan-400 transition-all"
                onClick={() => {
                  soundFx.playArrival();
                  setAnimPhase(3);
                }}
              >
                <div className="border border-dashed border-cyan-400/40 rounded-xl p-4 sm:p-6 bg-cyan-950/20">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 font-bold mb-2">
                    <span>┌─── DATA PACKET ───┐</span>
                    <span>1,500 BYTES</span>
                  </div>
                  
                  <div className="my-4 py-4 px-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center gap-3">
                    <Layers className="w-6 h-6 text-cyan-400 animate-bounce" />
                    <span className="font-display font-black text-lg sm:text-xl text-white tracking-wider">
                      [ SEALED PACKET ]
                    </span>
                  </div>

                  <p className="text-xs font-mono text-cyan-300 font-bold animate-pulse flex items-center justify-center gap-1.5">
                    <Eye className="w-4 h-4" /> Click to activate X-Ray inspection
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => {
                    soundFx.playArrival();
                    setAnimPhase(3);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-black font-bold font-mono text-xs shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all cursor-pointer inline-flex items-center gap-2 hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  <span>🔬 Open Exploded X-Ray Layers</span>
                </button>
              </div>
            </div>
          )}

          {/* Phase 3: Exploded Layer X-Ray Interactive Experience */}
          {animPhase === 3 && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Interactive Layer Pills Bar (Quick Selector) */}
              <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 font-mono text-xs">
                {LAYERS.map((layer) => {
                  const isSelected = activeLayer === layer.key;
                  return (
                    <button
                      key={layer.key}
                      onClick={() => handleSelectLayer(layer.key)}
                      className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[44px] ${
                        isSelected
                          ? `bg-slate-800 border ${layer.borderGlow} ${layer.color} font-bold`
                          : 'bg-black/40 border border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                      aria-label={`Inspect layer ${layer.number}: ${layer.name}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-bold">
                        {layer.number}
                      </span>
                      <span>{layer.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Dual-Column Layout: Exploded Packet Diagram & Detailed Layer Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* Left Column: Exploded 6-Layer Interactive Visual Diagram (6 cols) */}
                <div className="lg:col-span-6 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1 mb-1">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Exploded Packet Structure (Click any layer):</span>
                    </span>
                    <span className="text-[11px] text-cyan-400">6 Layers</span>
                  </div>

                  <div className="space-y-2 relative" role="region" aria-label="Exploded Packet Layer Diagram">
                    {LAYERS.map((layer) => {
                      const isSelected = activeLayer === layer.key;
                      return (
                        <div
                          key={layer.key}
                          onClick={() => handleSelectLayer(layer.key)}
                          className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                            isSelected
                              ? `${layer.borderGlow} bg-[#0c1228] scale-[1.02]`
                              : 'border-white/10 bg-[#090d1f]/80 hover:bg-[#0e142c] hover:border-cyan-500/30'
                          }`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectLayer(layer.key);
                            }
                          }}
                          aria-selected={isSelected}
                          aria-label={`Layer ${layer.number}: ${layer.name}. ${layer.summary}`}
                        >
                          {/* Active laser glow beam */}
                          {isSelected && (
                            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-400 to-purple-400 animate-pulse" />
                          )}

                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                              <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                                isSelected ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/10 text-slate-300'
                              }`}>
                                #{layer.number}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`font-mono font-bold text-xs sm:text-sm tracking-wide ${isSelected ? layer.color : 'text-white'}`}>
                                    {layer.name}
                                  </span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400 hidden sm:inline">
                                    {layer.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300 truncate font-normal mt-0.5">
                                  {layer.summary}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 text-right">
                              {isSelected ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-300 px-2 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Inspecting</span>
                                </span>
                              ) : (
                                <span className="text-xs text-slate-500 font-mono group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all">
                                  Inspect ➔
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Deep Layer X-Ray Inspector Card (6 cols) */}
                <div className="lg:col-span-6 flex flex-col">
                  <div className={`glass-panel p-4 sm:p-5 rounded-3xl border ${currentLayerInfo.borderGlow} bg-gradient-to-b from-[#0c1228] to-[#070b18] flex-1 flex flex-col justify-between shadow-2xl relative overflow-hidden`}>
                    
                    {/* Top Layer Header */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-white/10 text-white border border-white/10">
                            {currentLayerInfo.icon}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                              Layer #{currentLayerInfo.number} • {currentLayerInfo.badge}
                            </span>
                            <h4 className={`text-base sm:text-xl font-display font-extrabold ${currentLayerInfo.color}`}>
                              {currentLayerInfo.name}
                            </h4>
                          </div>
                        </div>

                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Educational Simulation
                        </span>
                      </div>

                      {/* Primary Simple Explanation */}
                      <div className="mt-4 p-3.5 rounded-2xl bg-black/50 border border-white/10 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                          What this layer does:
                        </span>
                        <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                          "{currentLayerInfo.simpleExplanation}"
                        </p>
                      </div>

                      {/* Real-World Everyday Analogy */}
                      <div className="mt-3 p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-start gap-2.5 text-xs text-slate-200">
                        <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-purple-300 block mb-0.5">Real-World Analogy:</strong>
                          <span>{currentLayerInfo.analogy}</span>
                        </div>
                      </div>

                      {/* Simulated Technical Packet Fields Grid */}
                      <div className="mt-4 space-y-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                          Simulated Header & Data Fields:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                          {currentLayerInfo.technicalDetails.map((tech, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/10">
                              <span className="text-[10px] text-slate-400 block font-bold">{tech.label}</span>
                              <span className="text-slate-100 font-semibold break-all">{tech.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick navigation to other layers */}
                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Explore all 6 layers to master packet mechanics</span>
                      <button
                        onClick={() => {
                          const nextIdx = (currentLayerInfo.number) % LAYERS.length;
                          handleSelectLayer(LAYERS[nextIdx].key);
                        }}
                        className="text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1 cursor-pointer"
                        aria-label="Next packet layer"
                      >
                        <span>Next Layer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EDUCATIONAL VALUE INSIGHT (VISUALLY HIGHLIGHTED) */}
          <div
            id="packet-xray-key-insight"
            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-indigo-950/50 to-purple-950/60 border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.25)] relative overflow-hidden"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0" aria-hidden="true">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
                  💡 Key Educational Takeaway
                </span>
                <p className="text-sm sm:text-base font-display font-bold text-white leading-relaxed">
                  "Your message does not travel as one simple piece of text. Networks organize information into structured packets so it can travel efficiently."
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-xs font-mono text-slate-400">
            <span>Educational Simulation • Illustrates standard TCP/IP packet encapsulation (RFC 791/793)</span>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-white/10 bg-[#060917] flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>X-Ray active: 6 layers inspected</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
              aria-label="Close Packet X-Ray"
            >
              Close X-Ray (Esc)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
