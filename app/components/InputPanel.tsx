'use client';

import React, { useState } from 'react';
import CustomDropdown from './CustomDropdown';

type LabelingTask = 'Intent Classification' | 'Sentiment Analysis' | 'User Signal Classification';
type LabelingMode = 'Zero-shot' | 'Few-shot';

interface InputPanelProps {
  onGenerate: (task: LabelingTask, mode: LabelingMode, text: string) => void;
  isGenerating?: boolean;
}

const labelingTasks: LabelingTask[] = [
  'Intent Classification',
  'Sentiment Analysis',
  'User Signal Classification',
];

export default function InputPanel({ onGenerate, isGenerating = false }: InputPanelProps) {
  const [task, setTask] = useState<LabelingTask | ''>('');
  const [mode, setMode] = useState<LabelingMode>('Zero-shot');
  const [text, setText] = useState('');

  const handleGenerate = () => {
    if (!task) return; // Don't generate if no task is selected
    onGenerate(task, mode, text);
  };

  return (
    <div className="flex h-full flex-col items-center p-6 overflow-y-auto">
      {/* Top Spacer */}
      <div className="h-16" />
      
      {/* Labeling Task */}
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-2xl font-semibold bg-gradient-to-r from-[#D50B8B] to-[#F08BC8] bg-clip-text text-transparent">Labeling Task</label>
          <CustomDropdown
            value={task}
            options={labelingTasks}
            onChange={(value) => setTask(value)}
            placeholder="Select a labeling task..."
            onOpen={() => setTask('')}
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Labeling Mode */}
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-2xl font-semibold bg-gradient-to-r from-[#C95792] to-[#E8A8C5] bg-clip-text text-transparent">Labeling Mode</label>
          <div className="flex gap-2 rounded-xl border border-[#0065F8]/20 bg-zinc-900/50 p-1 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setMode('Zero-shot')}
              className={`flex-1 rounded-lg px-4 py-4 text-base font-medium transition-all ${
                mode === 'Zero-shot'
                  ? 'bg-gradient-to-r from-[#0065F8]/20 to-[#00FFDE]/20 text-[#00CAFF] shadow-lg shadow-[#0065F8]/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Zero-shot
            </button>
            <button
              type="button"
              onClick={() => setMode('Few-shot')}
              className={`flex-1 rounded-lg px-4 py-4 text-base font-medium transition-all ${
                mode === 'Few-shot'
                  ? 'bg-gradient-to-r from-[#0065F8]/20 to-[#00FFDE]/20 text-[#00CAFF] shadow-lg shadow-[#0065F8]/10'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Few-shot
            </button>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Text Input and Generate Button */}
      <div className="flex flex-col items-center gap-3 w-full max-w-md mb-6">
        {/* Text Input Area */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-2xl font-semibold bg-gradient-to-r from-[#C95792] to-[#E8A8C5] bg-clip-text text-transparent">Text Input</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type text to label…"
            className="h-48 resize-none rounded-xl border border-[#00FFDE]/20 bg-zinc-900/50 p-4 text-lg text-zinc-100 placeholder-zinc-500 placeholder:italic backdrop-blur-sm transition-all focus:border-[#00FFDE]/40 focus:outline-none focus:ring-2 focus:ring-[#00FFDE]/20 focus:shadow-inner"
          />
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="rounded-full bg-gradient-to-r from-[#0065F8] to-[#00FFDE] px-20 py-5 text-lg font-bold text-white shadow-lg shadow-[#0065F8]/50 transition-all hover:from-[#0065F8] hover:to-[#00CAFF] hover:shadow-xl hover:shadow-[#0065F8]/60 disabled:cursor-not-allowed disabled:from-[#0065F8]/50 disabled:to-[#00FFDE]/50 disabled:opacity-70"
        >
          {isGenerating ? 'Generating...' : 'Generate Labels'}
        </button>
      </div>
    </div>
  );
}
