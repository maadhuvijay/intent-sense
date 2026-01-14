'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';

type LabelingTask = 'Intent Classification' | 'Sentiment Analysis' | 'User Signal Classification';
type LabelingMode = 'Zero-shot' | 'Few-shot';

interface LabelResult {
  label: string | string[];
  confidence: number;
  ambiguity: boolean;
  humanReview: boolean;
  json: string;
}

export default function Home() {
  const [result, setResult] = useState<LabelResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (
    task: LabelingTask,
    mode: LabelingMode,
    text: string
  ) => {
    if (!text.trim()) {
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      // Convert task and mode to lowercase for API
      const taskLower = task.toLowerCase();
      const modeLower = mode.toLowerCase();

      const response = await fetch('/api/label', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: taskLower,
          mode: modeLower,
          text: text.trim(),
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate labels';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON (e.g., HTML error page), use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const apiResult = await response.json();

      // Format label for display (handle array)
      const labelDisplay = Array.isArray(apiResult.label)
        ? apiResult.label.join(', ')
        : apiResult.label;

      // Convert confidence from 0-1 to percentage
      const confidencePercent = Math.round(apiResult.confidence * 100);

      const formattedResult: LabelResult = {
        label: labelDisplay,
        confidence: confidencePercent,
        ambiguity: apiResult.ambiguity_detected || false,
        humanReview: apiResult.review_recommended || false,
        json: JSON.stringify(apiResult, null, 2),
      };

      setResult(formattedResult);
    } catch (err: any) {
      console.error('Error generating labels:', err);
      setError(err.message || 'An error occurred while generating labels');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f]">
      {/* Base Layer - Deep Charcoal Background */}
      <div className="fixed inset-0 bg-[#0f0f0f]" />
      
      {/* Gradient Glow Layer - Bottom Radial Glow */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(ellipse 140% 100% at 50% 100%, rgba(76, 29, 149, 0.5) 0%, rgba(91, 33, 182, 0.35) 25%, rgba(109, 40, 217, 0.2) 45%, transparent 70%)'
        }}
      />
      
      {/* Background texture */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none" />
      
      <Header />
      
      <main className="relative z-10 flex flex-1 overflow-hidden py-6 px-12 gap-6 justify-center">
        {/* Left Panel - Input */}
        <div className="flex w-[42%] flex-col">
          <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden">
            {/* Glass highlight overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30 pointer-events-none rounded-3xl" />
            {/* Subtle color tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0065F8]/10 via-[#00CAFF]/5 to-[#00FFDE]/5 pointer-events-none rounded-3xl" />
            <div className="relative z-10 h-full">
              <InputPanel onGenerate={handleGenerate} isGenerating={isGenerating} />
            </div>
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="flex w-[42%] flex-col">
          <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden">
            {/* Glass highlight overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-30 pointer-events-none rounded-3xl" />
            {/* Subtle color tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0065F8]/10 via-[#00CAFF]/5 to-[#00FFDE]/5 pointer-events-none rounded-3xl" />
            <div className="relative z-10 h-full">
              <OutputPanel result={result} error={error} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
