import React, { useEffect, useRef } from 'react';
import { PacketChunk, NetworkStage } from '../types';
import { X, Layers, Binary, Hash, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface PacketInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  packet: PacketChunk | null;
  currentStage: NetworkStage;
  isEncrypted: boolean;
}

export const PacketInspectorModal: React.FC<PacketInspectorModalProps> = ({
  isOpen,
  onClose,
  packet,
  currentStage,
  isEncrypted,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundFx.playClick();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !packet) return null;

  return (
    <div
      id="packet-inspector-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-title"
    >
      <div
        id="packet-inspector-card"
        className="relative w-full max-w-2xl bg-[#0d1224] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0" aria-hidden="true">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 id="inspector-title" className="font-display text-sm sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span>Packet Deep Inspector</span>
                <span className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  #{packet.id} / {packet.total}
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 font-mono truncate">
                At Stage: <span className="text-cyan-300 font-bold">{currentStage.title}</span>
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            id="close-inspector-modal-btn"
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer shrink-0 ml-2"
            aria-label="Close packet inspector dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          {/* Packet Header (TCP/IP Metadata) */}
          <div>
            <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold mb-2.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" aria-hidden="true" />
              IPv4 & TCP Header (Layer 3 & 4)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="glass-panel p-2 sm:p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 block font-bold">SOURCE IP</span>
                <span className="text-cyan-300 font-semibold text-[11px] sm:text-xs break-all">{packet.sourceIp}</span>
              </div>
              <div className="glass-panel p-2 sm:p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 block font-bold">DESTINATION IP</span>
                <span className="text-purple-300 font-semibold text-[11px] sm:text-xs break-all">{packet.destIp}</span>
              </div>
              <div className="glass-panel p-2 sm:p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 block font-bold">PORTS (SRC➔DST)</span>
                <span className="text-slate-100 text-[11px] sm:text-xs font-medium">{packet.sourcePort} ➔ {packet.destPort}</span>
              </div>
              <div className="glass-panel p-2 sm:p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-slate-400 block font-bold">TTL (TIME TO LIVE)</span>
                <span className="text-emerald-400 font-semibold text-[11px] sm:text-xs">{packet.ttl} Hops Left</span>
              </div>
            </div>
          </div>

          {/* Payload Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" aria-hidden="true" />
              Packet Data Payload (Chunk #{packet.id})
            </h4>

            {/* Plaintext vs Ciphertext */}
            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-2">
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs text-slate-300">
                <span className="font-mono text-[11px] sm:text-xs font-bold">PAYLOAD TEXT:</span>
                {isEncrypted ? (
                  <span className="flex items-center gap-1 text-emerald-300 font-mono text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> TLS 1.3 ENCRYPTED
                  </span>
                ) : (
                  <span className="text-amber-300 font-mono text-[11px] font-bold">⚠️ UNENCRYPTED PLAINTEXT</span>
                )}
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-xs sm:text-sm text-cyan-300 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="break-all font-bold">"{packet.textPayload}"</span>
                <span className="text-[11px] text-slate-400 font-normal shrink-0">
                  Checksum: <strong className="text-slate-200 font-mono">{packet.checksum}</strong>
                </span>
              </div>
            </div>

            {/* Binary stream */}
            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1 font-mono text-[11px] sm:text-xs font-bold">
                  <Binary className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" /> RAW BINARY STREAM (1s & 0s)
                </span>
                <span className="text-[10px] font-mono text-slate-400">8-bit UTF-8</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] sm:text-xs text-emerald-400 tracking-wider break-all leading-relaxed font-bold">
                {packet.binaryPayload}
              </div>
            </div>

            {/* Hex Dump */}
            <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1 font-mono text-[11px] sm:text-xs font-bold">
                  <Hash className="w-3.5 h-3.5 text-purple-400 shrink-0" aria-hidden="true" /> HEXADECIMAL DUMP
                </span>
                <span className="text-[10px] font-mono text-slate-400">Base-16 Bytes</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] sm:text-xs text-purple-300 tracking-wider break-all font-bold">
                {packet.hexPayload}
              </div>
            </div>
          </div>

          {/* Current Stage Transformation */}
          <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/30">
            <h5 className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold mb-1 flex items-center gap-1">
              <ArrowRight className="w-3.5 h-3.5 shrink-0 text-cyan-400" aria-hidden="true" /> Stage Transformation at {currentStage.title}
            </h5>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {currentStage.packetTransform}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-white/10 bg-slate-950/90 flex justify-end shrink-0">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/40 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center"
          >
            Close Inspector (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
