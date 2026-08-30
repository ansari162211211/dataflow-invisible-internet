import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/audio';
import { scrambleText, textToBinary } from '../utils/packetConverter';
import {
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  Sparkles,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Radio,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers,
  Zap,
} from 'lucide-react';

interface EncryptionSectionProps {
  onToggleSimEncryption?: (enabled: boolean) => void;
  reducedMotion?: boolean;
  onAnnounce?: (msg: string) => void;
}

export const EncryptionSection: React.FC<EncryptionSectionProps> = ({
  onToggleSimEncryption,
  reducedMotion = false,
  onAnnounce,
}) => {
  const [userMessage, setUserMessage] = useState<string>('HELLO INTERNET');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [encryptionMode, setEncryptionMode] = useState<boolean>(true);

  // Derived simulated data representations
  const safeText = userMessage.trim() || 'HELLO';
  const binaryData = textToBinary(safeText);
  const encryptedCipher = scrambleText(safeText, 57);

  // Step definitions matching the user's explicit requested flow:
  // Original Message -> Convert to Digital Data -> Encrypt -> Encrypted Data -> Travel Through Internet -> Decrypt -> Original Message Restored
  const STEPS = [
    {
      id: 1,
      title: 'Original Message',
      badge: 'Step 1',
      icon: '💬',
      desc: 'The human-readable message you typed.',
      data: safeText,
      tag: 'Plaintext',
      color: 'border-cyan-400 bg-cyan-500/10 text-cyan-300',
    },
    {
      id: 2,
      title: 'Convert to Digital Data',
      badge: 'Step 2',
      icon: '🔢',
      desc: 'Letters and words are converted into 1s and 0s.',
      data: binaryData.slice(0, 16) + (binaryData.length > 16 ? '...' : ''),
      tag: 'Binary Bits',
      color: 'border-emerald-400 bg-emerald-500/10 text-emerald-300',
    },
    {
      id: 3,
      title: 'Encrypt',
      badge: 'Step 3',
      icon: '🔐',
      desc: 'A secret mathematical key scrambles the data.',
      data: encryptionMode ? 'Applying AES-256 Key...' : 'No Key Applied (Unprotected)',
      tag: encryptionMode ? 'Key Locking' : 'Bypassed',
      color: encryptionMode
        ? 'border-purple-400 bg-purple-500/10 text-purple-300'
        : 'border-amber-400 bg-amber-500/10 text-amber-300',
    },
    {
      id: 4,
      title: 'Encrypted Data',
      badge: 'Step 4',
      icon: '🛡️',
      desc: 'Data becomes an unreadable secret code.',
      data: encryptionMode ? encryptedCipher : safeText,
      tag: encryptionMode ? 'Ciphertext' : 'Plaintext Exposed',
      color: encryptionMode
        ? 'border-purple-400 bg-purple-500/20 text-purple-200'
        : 'border-red-400 bg-red-500/20 text-red-200',
    },
    {
      id: 5,
      title: 'Travel Through Internet',
      badge: 'Step 5',
      icon: '⚡',
      desc: 'The scrambled packets travel safely through public wires & routers.',
      data: encryptionMode
        ? `🔒 [${encryptedCipher.slice(0, 8)}...] in Transit`
        : `⚠️ [${safeText}] Exposed in Transit`,
      tag: 'Public Cables',
      color: 'border-blue-400 bg-blue-500/10 text-blue-300',
    },
    {
      id: 6,
      title: 'Decrypt',
      badge: 'Step 6',
      icon: '🗝️',
      desc: 'The recipient uses the matching private key to unlock the data.',
      data: encryptionMode ? 'Unlocking with Matching Key...' : 'Direct Passthrough',
      tag: 'Key Unlocking',
      color: 'border-emerald-400 bg-emerald-500/10 text-emerald-300',
    },
    {
      id: 7,
      title: 'Original Message Restored',
      badge: 'Step 7',
      icon: '🎉',
      desc: 'The original text is safely restored on the destination screen!',
      data: safeText,
      tag: 'Restored Message',
      color: 'border-cyan-400 bg-cyan-500/20 text-white font-bold',
    },
  ];

  // Execute interactive encryption animation flow
  const handleStartEncryptionFlow = () => {
    soundFx.playClick();
    soundFx.playEncrypt();
    setIsEncrypting(true);
    setActiveStep(1);
    onAnnounce?.('Started encryption flow. Step 1: Original message.');

    const delay = reducedMotion ? 350 : 700;

    // Step through each of the 7 stages sequentially
    const stepIntervals = [
      setTimeout(() => {
        setActiveStep(2);
        soundFx.playHop(2);
        onAnnounce?.('Step 2: Convert message to digital binary bits.');
      }, delay),
      setTimeout(() => {
        setActiveStep(3);
        soundFx.playEncrypt();
        onAnnounce?.('Step 3: Encrypt with secret mathematical key.');
      }, delay * 2),
      setTimeout(() => {
        setActiveStep(4);
        soundFx.playHop(4);
        onAnnounce?.('Step 4: Encrypted ciphertext produced.');
      }, delay * 3),
      setTimeout(() => {
        setActiveStep(5);
        soundFx.playHop(5);
        onAnnounce?.('Step 5: Traveling across public internet cables.');
      }, delay * 4),
      setTimeout(() => {
        setActiveStep(6);
        soundFx.playEncrypt();
        onAnnounce?.('Step 6: Decrypting using matching private key.');
      }, delay * 5),
      setTimeout(() => {
        setActiveStep(7);
        soundFx.playArrival();
        setIsEncrypting(false);
        onAnnounce?.('Step 7: Original message safely restored at destination!');
      }, delay * 6),
    ];

    return () => stepIntervals.forEach(clearTimeout);
  };

  const handleReset = () => {
    soundFx.playClick();
    setActiveStep(1);
    setIsEncrypting(false);
    onAnnounce?.('Encryption simulation reset.');
  };

  // Toggle encryption mode
  const handleToggleMode = () => {
    soundFx.playClick();
    const nextMode = !encryptionMode;
    setEncryptionMode(nextMode);
    onAnnounce?.(nextMode ? 'Encryption mode enabled (HTTPS/TLS)' : 'Plaintext mode enabled (Unencrypted)');
    if (onToggleSimEncryption) {
      onToggleSimEncryption(nextMode);
    }
  };

  // Run on mount
  useEffect(() => {
    setActiveStep(1);
  }, [userMessage]);

  return (
    <section
      id="encryption"
      className="relative py-14 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16 sm:scroll-mt-20 w-full"
      aria-label="Interactive Data Encryption Lab"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] sm:text-xs font-mono uppercase tracking-wider mb-3 sm:mb-4">
          <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" aria-hidden="true" />
          <span>Visualizing the Invisible: Cryptographic Cipher Lab</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3 sm:mb-4 break-words">
          How Encryption Protects Your Data
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-300 px-1 leading-relaxed">
          When data travels across public internet cables, anyone in between could try to look at it.
          <strong className="text-purple-300"> Encryption</strong> transforms your readable message into a scrambled secret code that only the intended recipient can unlock.
        </p>
      </div>

      {/* Main Interactive Encryption Card */}
      <div className="glass-panel p-4 sm:p-8 lg:p-10 rounded-3xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] mb-8 sm:mb-12">
        {/* User Input & Action Ribbon */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-white/10">
          {/* Custom Sample Message Input */}
          <div className="flex-1 w-full max-w-xl">
            <label
              htmlFor="encryption-sample-input"
              className="text-[11px] sm:text-xs font-mono text-purple-300 uppercase tracking-wider block mb-2 font-semibold"
            >
              Enter Your Sample Message:
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                id="encryption-sample-input"
                type="text"
                value={userMessage}
                maxLength={24}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Type any message (e.g. My secret password)"
                className="flex-1 bg-[#0b0f1d] text-white px-4 py-3 rounded-2xl border border-white/15 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40 font-mono text-sm sm:text-base outline-none font-bold"
              />
              <button
                id="encrypt-message-btn"
                onClick={handleStartEncryptionFlow}
                disabled={isEncrypting}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-display font-bold text-sm sm:text-base transition-all shadow-[0_0_25px_rgba(168,85,247,0.5)] shrink-0 disabled:opacity-50 cursor-pointer active:scale-95 min-h-[48px] flex items-center justify-center gap-2 border border-purple-300/30"
                title="Click to run the step-by-step encryption animation"
              >
                {isEncrypting ? (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200 animate-spin" />
                    <span>Encrypting...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-purple-200" />
                    <span>Encrypt Message</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mode & Reset Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <button
              id="toggle-encryption-mode-btn"
              onClick={handleToggleMode}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer min-h-[44px] ${
                encryptionMode
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25'
              }`}
              title="Toggle between encrypted HTTPS and unprotected plaintext"
            >
              {encryptionMode ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Mode: Encrypted (HTTPS)</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
                  <span>Mode: Unencrypted (Plaintext)</span>
                </>
              )}
            </button>

            <button
              id="reset-encryption-btn"
              onClick={handleReset}
              disabled={isEncrypting}
              className="p-2.5 rounded-xl glass-panel text-slate-400 hover:text-white hover:border-purple-400 flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px]"
              title="Reset Flow"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Step-by-Step Interactive Flow Visualizer */}
        <div className="py-6 sm:py-8">
          <div className="flex items-center justify-between gap-2 mb-6">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Step-by-Step Encryption Flow:
            </span>
            <span className="text-xs font-mono text-slate-400">
              Active: <strong className="text-cyan-300">Step {activeStep || 1} of 7</strong>
            </span>
          </div>

          {/* Desktop & Tablet Horizontal Grid */}
          <div className="hidden md:grid md:grid-cols-7 gap-2.5 relative" role="region" aria-label="7-Step Encryption Process">
            {/* Background connecting track line */}
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-white/10 -translate-y-1/2 z-0" aria-hidden="true" />
            <div
              className="absolute top-1/2 left-4 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${Math.min(100, ((activeStep - 1) / 6) * 100)}%` }}
              aria-hidden="true"
            />

            {STEPS.map((step) => {
              const isCurrent = activeStep === step.id;
              const isPassed = activeStep > step.id;

              return (
                <button
                  key={step.id}
                  id={`enc-step-${step.id}`}
                  onClick={() => {
                    soundFx.playHop(step.id);
                    setActiveStep(step.id);
                    onAnnounce?.(`Selected ${step.badge}: ${step.title}. ${step.desc}`);
                  }}
                  className={`relative z-10 p-3 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer min-h-[190px] focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                    isCurrent
                      ? 'glass-panel-glow border-purple-400 scale-105 shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                      : isPassed
                      ? 'glass-panel border-emerald-500/40 opacity-95'
                      : 'glass-panel border-white/10 opacity-55 hover:opacity-85'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${step.badge}: ${step.title}. ${step.desc}`}
                >
                  {/* Step Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase mb-1.5 ${
                      isCurrent
                        ? 'bg-purple-500 text-white shadow'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {step.badge}
                  </span>

                  {/* Icon Circle */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg my-1 transition-all ${
                      isCurrent
                        ? 'bg-purple-500/30 border border-purple-400 scale-110 shadow-[0_0_15px_rgba(168,85,247,0.6)]'
                        : isPassed
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : 'bg-white/5 border border-white/10'
                    }`}
                    aria-hidden="true"
                  >
                    {step.icon}
                  </div>

                  {/* Step Title */}
                  <h4 className="font-display font-bold text-xs text-white leading-tight my-1">
                    {step.title}
                  </h4>

                  {/* Step Data Pill */}
                  <div className="w-full mt-auto pt-2 border-t border-white/5">
                    <div className="px-1.5 py-1 rounded bg-[#070b16] border border-white/10 font-mono text-[10px] truncate max-w-full text-slate-200">
                      {step.data}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Vertical Flow Stack */}
          <div className="md:hidden space-y-3" role="region" aria-label="7-Step Encryption Process">
            {STEPS.map((step) => {
              const isCurrent = activeStep === step.id;
              const isPassed = activeStep > step.id;

              return (
                <button
                  type="button"
                  key={step.id}
                  id={`mobile-enc-step-${step.id}`}
                  onClick={() => {
                    soundFx.playHop(step.id);
                    setActiveStep(step.id);
                    onAnnounce?.(`Selected ${step.badge}: ${step.title}. ${step.desc}`);
                  }}
                  className={`w-full p-3.5 rounded-2xl flex items-start gap-3 transition-all cursor-pointer text-left min-h-[64px] focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                    isCurrent
                      ? 'glass-panel-glow border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                      : isPassed
                      ? 'glass-panel border-emerald-500/30 opacity-90'
                      : 'glass-panel border-white/10 opacity-60'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${step.badge}: ${step.title}. ${step.desc}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-lg shrink-0" aria-hidden="true">
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-purple-300 uppercase">
                        {step.badge}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                        {step.tag}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm text-white">{step.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{step.desc}</p>
                    <div className="mt-2 p-1.5 rounded-lg bg-[#070b16] border border-white/10 font-mono text-xs text-cyan-300 truncate">
                      {step.data}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Highlighted Active Step Detail Box */}
        {activeStep > 0 && (
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-cyan-950/40 border border-purple-500/30 mt-4 sm:mt-6 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">{STEPS[activeStep - 1]?.icon}</span>
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-300 font-bold">
                    ACTIVE STEP {activeStep} OF 7
                  </span>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white">
                    {STEPS[activeStep - 1]?.title}
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-cyan-300 border border-white/10 self-start sm:self-auto">
                {STEPS[activeStep - 1]?.tag}
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-200 mt-3 leading-relaxed">
              {STEPS[activeStep - 1]?.desc}
            </p>

            <div className="mt-3.5 p-3 rounded-xl bg-black/70 border border-white/10 font-mono text-xs sm:text-sm text-cyan-300 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-slate-400 text-xs">Current Representation:</span>
              <strong className="text-white break-all tracking-wider">
                {STEPS[activeStep - 1]?.data}
              </strong>
            </div>
          </div>
        )}

        {/* Snooper / Hacker Contrast Card: What Happens on Public Internet */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Public Network Snooper Perspective */}
          <div
            className={`p-4 sm:p-6 rounded-2xl border transition-all ${
              encryptionMode
                ? 'bg-slate-900/80 border-white/10'
                : 'bg-red-950/30 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
            }`}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {encryptionMode ? (
                  <EyeOff className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <Eye className="w-5 h-5 text-red-400 animate-bounce shrink-0" />
                )}
                <h4 className="font-display font-bold text-sm sm:text-base text-white truncate">
                  What an Eavesdropper Sees on Wi-Fi / Wire:
                </h4>
              </div>
              <span
                className={`text-[10px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                  encryptionMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {encryptionMode ? 'LOCKED 🔒' : 'EXPOSED ⚠️'}
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-black/80 font-mono text-sm border border-white/5 space-y-2">
              <div className="text-[11px] text-slate-500">INTERCEPTED WIRE DATA:</div>
              <div
                className={`text-sm sm:text-base font-bold tracking-widest break-all ${
                  encryptionMode ? 'text-purple-400' : 'text-red-400'
                }`}
              >
                {encryptionMode ? encryptedCipher : safeText}
              </div>
              <p className="text-xs text-slate-400 pt-2 border-t border-white/5 leading-relaxed">
                {encryptionMode
                  ? 'With encryption ON, anyone snooping only sees scrambled gibberish. Without the private key, it cannot be read.'
                  : 'WARNING: Without encryption (plain HTTP), anyone on the same Wi-Fi router or wire can read your raw message word-for-word!'}
              </p>
            </div>
          </div>

          {/* Simple Lock & Key Analogy */}
          <div className="p-4 sm:p-6 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-300 mb-2 sm:mb-3">
                <Key className="w-5 h-5 text-purple-400 shrink-0" />
                <h4 className="font-display font-bold text-sm sm:text-base text-white">
                  The Lockbox Analogy
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Imagine locking your letter inside a metal box with a padlock before handing it to a postal courier.
                Even if someone intercepts the box on the road, they cannot open it without the <strong>matching key</strong>.
                Only the recipient at the destination has the key to unlock and read it.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 font-mono text-xs pt-3 border-t border-purple-500/20">
              <div className="glass-panel p-2 sm:p-2.5 rounded-xl text-center">
                <span className="text-[9px] sm:text-[10px] text-slate-400 block">ENCRYPTION KEY</span>
                <span className="text-purple-300 font-semibold text-xs">Locks Message 🔒</span>
              </div>
              <div className="glass-panel p-2 sm:p-2.5 rounded-xl text-center">
                <span className="text-[9px] sm:text-[10px] text-slate-400 block">DECRYPTION KEY</span>
                <span className="text-emerald-300 font-semibold text-xs">Unlocks Message 🗝️</span>
              </div>
            </div>
          </div>
        </div>

        {/* First-Time User Takeaway: Why HTTPS is Essential */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-emerald-950/40 border border-purple-500/30">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-xs sm:text-sm font-display mb-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>💡 3 Key Things to Remember About Encryption:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-200">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <strong className="block text-purple-300 mb-0.5">1. Scrambles Secrets</strong>
              <p className="text-[11px] text-slate-300">Turns your readable passwords and texts into unrecognizable ciphertext before it leaves your phone or laptop.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <strong className="block text-purple-300 mb-0.5">2. Protects on Public Wi-Fi</strong>
              <p className="text-[11px] text-slate-300">Coffee shop Wi-Fi sniffers can't read your logins because HTTPS keeps the payload locked in transit.</p>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <strong className="block text-purple-300 mb-0.5">3. Only Destination Can Read</strong>
              <p className="text-[11px] text-slate-300">Only the real authenticated server holds the mathematical key required to decrypt and view the payload.</p>
            </div>
          </div>
        </div>

        {/* Educational Disclaimer */}
        <div className="mt-6 p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200">Educational Note:</strong> This is a simplified interactive visualization designed for educational understanding of cryptographic principles (HTTPS, TLS, AES), rather than a production cryptography library implementation.
          </div>
        </div>
      </div>
    </section>
  );
};

