import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { Sparkles, Coins, Video, Layers, Wand2 } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { credits, activeTab, setActiveTab, activeJob } = useStudio();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'text-to-video': return 'Text-to-Video Studio';
      case 'image-to-video': return 'Image-to-Video Animator';
      case 'reference-to-video': return 'Reference Video Studio';
      case 'video-to-video': return 'Video Transformation';
      case 'characters': return 'Character Consistency';
      case 'history': return 'Generations History';
      case 'settings': return 'Studio Settings';
      default: return 'AI Video Studio';
    }
  };

  return (
    <header className="h-16 px-6 border-b border-[#22222a] bg-[#0c0c0e]/95 backdrop-blur sticky top-0 z-30 flex items-center justify-between gap-8">
      {/* Zone 1: Breadcrumb and title */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#181820]"
          aria-label="Toggle navigation"
        >
          <Layers className="w-5 h-5" />
        </button>
        <span className="text-xs text-zinc-500 font-mono tracking-wider uppercase hidden sm:inline">AI Studio /</span>
        <h1 className="text-sm font-semibold text-zinc-100 tracking-tight">{getPageTitle()}</h1>
      </div>

      {/* Zone 2: Navigation Links (Clean single-line prose links) */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
        <button
          onClick={() => setActiveTab('text-to-video')}
          className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'text-to-video' ? 'text-purple-400 font-semibold' : ''}`}
        >
          Text-to-Video
        </button>
        <button
          onClick={() => setActiveTab('image-to-video')}
          className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'image-to-video' ? 'text-purple-400 font-semibold' : ''}`}
        >
          Image-to-Video
        </button>
        <button
          onClick={() => setActiveTab('reference-to-video')}
          className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'reference-to-video' ? 'text-purple-400 font-semibold' : ''}`}
        >
          Reference Mode
        </button>
        <button
          onClick={() => setActiveTab('characters')}
          className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'characters' ? 'text-purple-400 font-semibold' : ''}`}
        >
          Characters
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action Area */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        {activeJob && (
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>Rendering {activeJob.progress}%</span>
          </div>
        )}

        <button
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181820] hover:bg-[#20202a] border border-[#2b2b36] transition text-xs font-medium text-zinc-300"
          title="Manage credits & settings"
        >
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono tabular-nums text-zinc-100 font-semibold">{credits}</span>
          <span className="text-zinc-500 hidden sm:inline">Credits</span>
        </button>

        <button
          onClick={() => setActiveTab('text-to-video')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition whitespace-nowrap shrink-0"
        >
          <Video className="w-3.5 h-3.5" />
          <span>New Video</span>
        </button>
      </div>
    </header>
  );
};
