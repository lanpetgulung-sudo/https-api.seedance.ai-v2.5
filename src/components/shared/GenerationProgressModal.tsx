import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { Sparkles, Loader2, X, AlertCircle } from 'lucide-react';

export const GenerationProgressModal: React.FC = () => {
  const { activeJob, cancelActiveJob } = useStudio();

  if (!activeJob) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-[#121217]/95 border border-purple-500/30 rounded-2xl shadow-2xl backdrop-blur-xl p-5 space-y-4 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">
              Rendering {activeJob.duration}s Sequence
            </h4>
            <p className="text-[11px] text-zinc-400 font-mono truncate max-w-[200px]">
              {activeJob.type.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        <button
          onClick={cancelActiveJob}
          className="text-zinc-500 hover:text-zinc-300 p-1 rounded-md transition"
          title="Cancel Generation & Refund Credits"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-purple-300 font-medium text-[11px] truncate max-w-[240px]">
            {activeJob.stageText}
          </span>
          <span className="font-mono tabular-nums text-purple-400 font-bold text-xs">
            {activeJob.progress}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#1b1b24] rounded-full overflow-hidden p-0.5 border border-[#2b2b3a]">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(5, activeJob.progress)}%` }}
          />
        </div>
      </div>

      {/* Prompt preview */}
      <div className="p-2.5 rounded-lg bg-[#181820] border border-[#252530] text-[11px] text-zinc-300 line-clamp-2 italic">
        "{activeJob.prompt}"
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-500">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-400" /> Seedance 2.5 Engine
        </span>
        <button
          onClick={cancelActiveJob}
          className="text-red-400 hover:text-red-300 underline font-medium"
        >
          Cancel & Refund
        </button>
      </div>
    </div>
  );
};
