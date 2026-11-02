import React from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  Sparkles,
  Film,
  Image as ImageIcon,
  Layers,
  RefreshCw,
  Users,
  History,
  Settings,
  CreditCard,
  X,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
  { id: 'text-to-video', label: 'Text-to-Video', icon: Film },
  { id: 'image-to-video', label: 'Image-to-Video', icon: ImageIcon },
  { id: 'reference-to-video', label: 'Reference Mode', icon: Layers },
  { id: 'video-to-video', label: 'Video-to-Video', icon: RefreshCw },
  { id: 'characters', label: 'Character Presets', icon: Users },
  { id: 'history', label: 'Generations History', icon: History },
  { id: 'settings', label: 'Studio Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, credits, settings } = useStudio();

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0c0c0e] border-r border-[#22222a] flex flex-col justify-between transition-transform duration-200 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 px-5 border-b border-[#22222a] flex items-center justify-between">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
                S
              </div>
              <div>
                <div className="font-bold text-sm tracking-wide text-zinc-100 flex items-center gap-1.5">
                  SEEDANCE
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-semibold">
                    2.5
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 font-medium">AI Video Studio</div>
              </div>
            </button>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#181820]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-600/15 text-purple-300 border border-purple-500/25 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#16161b]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-zinc-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Credits & Engine Card */}
        <div className="p-3.5 border-t border-[#22222a] space-y-2.5">
          <div className="p-3 rounded-xl bg-[#14141a] border border-[#23232c] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                <CreditCard className="w-3.5 h-3.5 text-purple-400" /> Studio Credits
              </span>
              <span className="font-mono tabular-nums text-zinc-100 font-semibold">{credits}</span>
            </div>

            <div className="w-full bg-[#1e1e28] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (credits / 300) * 100)}%` }}
              />
            </div>

            <button
              onClick={() => handleNavClick('settings')}
              className="w-full py-1.5 rounded-lg bg-[#20202b] hover:bg-[#282836] text-[11px] font-medium text-zinc-300 hover:text-white transition text-center"
            >
              Add Credits
            </button>
          </div>

          {/* Engine indicator */}
          <div className="px-2 py-1 text-[11px] text-zinc-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-zinc-400" />
              {settings.enableMockMode ? 'Simulation Engine' : 'Seedance 2.5 API'}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">v2.5.4</span>
          </div>
        </div>
      </aside>
    </>
  );
};
