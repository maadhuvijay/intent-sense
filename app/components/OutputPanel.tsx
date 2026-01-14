'use client';

import React, { useState } from 'react';

interface LabelResult {
  label: string;
  confidence: number;
  ambiguity: boolean;
  humanReview: boolean;
  json: string;
}

interface OutputPanelProps {
  result: LabelResult | null;
  error?: string | null;
}

export default function OutputPanel({ result, error }: OutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    if (result?.json) {
      navigator.clipboard.writeText(result.json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6 overflow-y-auto">
        <div className="text-center max-w-md">
          <div className="mb-4 text-6xl opacity-20">⚠️</div>
          <p className="text-xl font-semibold text-red-400 mb-2">Error</p>
          <p className="text-base text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-full items-center justify-center p-6 overflow-y-auto">
        <div className="text-center">
          <div className="mb-4 text-6xl opacity-20">⚡</div>
          <p className="text-lg text-zinc-500">Results will appear here</p>
          <p className="mt-2 text-sm text-zinc-600">Click "Generate Labels" to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center p-6 overflow-y-auto">
      {/* Top Spacer */}
      <div className="h-16" />
      
      {/* Label */}
      <div className="flex flex-col items-center w-full max-w-md">
        <label className="text-2xl font-semibold bg-gradient-to-r from-[#C95792] to-[#E8A8C5] bg-clip-text text-transparent mb-2 w-full">Label</label>
        <div className="w-full rounded-xl border border-[#00FFDE]/20 bg-gradient-to-br from-[#00FFDE]/10 via-[#00FFDE]/5 to-[#00FFDE]/5 px-4 py-5 text-lg text-white backdrop-blur-xl shadow-[0_4px_16px_0_rgba(0,255,222,0.15)] min-h-[56px] flex items-center justify-center">
          <p className="text-lg text-white text-center">{result.label}</p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Confidence Score */}
      <div className="flex flex-col items-center w-full max-w-md">
        <label className="text-2xl font-semibold bg-gradient-to-r from-[#C95792] to-[#E8A8C5] bg-clip-text text-transparent mb-3 w-full">Confidence Score</label>
        <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-xl shadow-[0_4px_16px_0_rgba(0,0,0,0.25)] relative overflow-hidden">
          {/* Glass highlight overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent opacity-20 pointer-events-none rounded-2xl" />
          {/* Color tint */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0065F8]/5 via-[#00CAFF]/3 to-[#00FFDE]/5 pointer-events-none rounded-2xl" />
          <div className="relative z-10 p-5">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-zinc-800/50">
                  <div
                    className="h-full bg-gradient-to-r from-[#0065F8] via-[#00CAFF] to-[#00FFDE] transition-all"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>
              <span className="text-3xl font-bold text-[#00CAFF]">{result.confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Ambiguity Flag and Human Review */}
      <div className="flex items-start justify-between w-full max-w-md gap-8">
        {/* Ambiguity Flag - Left */}
        <div className="flex flex-col items-start flex-1">
          <label className="text-2xl font-semibold bg-gradient-to-r from-[#C95792] to-[#E8A8C5] bg-clip-text text-transparent mb-3">Ambiguity Flag</label>
          <div className="flex items-center gap-4">
            {/* Yes */}
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                result.ambiguity
                  ? 'border-[#00CAFF] bg-gradient-to-br from-[#0065F8] to-[#00FFDE]'
                  : 'border-zinc-500 bg-transparent'
              }`}>
                {result.ambiguity && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className={`text-base font-medium ${
                result.ambiguity ? 'text-[#00CAFF]' : 'text-zinc-400'
              }`}>
                Yes
              </span>
            </div>
            {/* No */}
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                !result.ambiguity
                  ? 'border-[#00CAFF] bg-gradient-to-br from-[#0065F8] to-[#00FFDE]'
                  : 'border-zinc-500 bg-transparent'
              }`}>
                {!result.ambiguity && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className={`text-base font-medium ${
                !result.ambiguity ? 'text-[#00CAFF]' : 'text-zinc-400'
              }`}>
                No
              </span>
            </div>
          </div>
        </div>

        {/* Human Review - Right */}
        <div className="flex flex-col items-end flex-1">
          <label className="text-2xl font-semibold bg-gradient-to-r from-[#C95792] to-[#E8A8C5] bg-clip-text text-transparent mb-3">Human Review</label>
          <div className="flex items-center gap-4">
            {/* Yes */}
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                result.humanReview
                  ? 'border-[#00CAFF] bg-gradient-to-br from-[#0065F8] to-[#00FFDE]'
                  : 'border-zinc-500 bg-transparent'
              }`}>
                {result.humanReview && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className={`text-base font-medium ${
                result.humanReview ? 'text-[#00CAFF]' : 'text-zinc-400'
              }`}>
                Yes
              </span>
            </div>
            {/* No */}
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                !result.humanReview
                  ? 'border-[#00CAFF] bg-gradient-to-br from-[#0065F8] to-[#00FFDE]'
                  : 'border-zinc-500 bg-transparent'
              }`}>
                {!result.humanReview && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className={`text-base font-medium ${
                !result.humanReview ? 'text-[#00CAFF]' : 'text-zinc-400'
              }`}>
                No
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Copy JSON Button */}
      <div className="flex flex-col items-center w-full max-w-md mb-6">
        <button
          type="button"
          onClick={handleCopyJson}
          className="rounded-full bg-gradient-to-r from-[#0065F8] to-[#00FFDE] px-28 py-5 text-lg font-bold text-white shadow-lg shadow-[#0065F8]/50 transition-all hover:from-[#0065F8] hover:to-[#00CAFF] hover:shadow-xl hover:shadow-[#0065F8]/60"
        >
          {copied ? '✓ Copied' : 'Copy JSON'}
        </button>
      </div>
    </div>
  );
}
