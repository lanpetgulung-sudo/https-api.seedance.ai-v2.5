import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { Info, ArrowRight, ShieldCheck } from 'lucide-react';

export const MockModeBanner: React.FC = () => {
  const { settings, setActiveTab } = useStudio();

  if (!settings.enableMockMode && settings.apiKey) {
    return null;
  }

  return (
    <div className="bg-[#181524] border-b border-purple-500/20 px-4 py-2 text-xs text-purple-200 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-purple-400 shrink-0" />
        <span className="leading-tight">
          <strong className="font-semibold text-purple-300">Simulation Engine Active:</strong> Video generation tests use realistic simulation pipelines and CC0 sample media without consuming external Seedance API quota.
        </span>
      </div>
      <button
        onClick={() => setActiveTab('settings')}
        className="flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-white bg-purple-600/30 hover:bg-purple-600/50 px-2.5 py-1 rounded transition shrink-0 whitespace-nowrap"
      >
        <span>Connect Live API Key</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
