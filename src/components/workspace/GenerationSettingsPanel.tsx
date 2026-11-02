import React from 'react';
import { AspectRatio, Resolution, OutputFormat } from '../../types/index';
import { Clock, Monitor, Volume2, VolumeX, Film, Layers } from 'lucide-react';

interface GenerationSettingsPanelProps {
  duration: number;
  setDuration: (v: number) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (v: AspectRatio) => void;
  resolution: Resolution;
  setResolution: (v: Resolution) => void;
  hasAudio: boolean;
  setHasAudio: (v: boolean) => void;
  outputFormat?: OutputFormat;
  setOutputFormat?: (v: OutputFormat) => void;
  disabled?: boolean;
}

export const GenerationSettingsPanel: React.FC<GenerationSettingsPanelProps> = ({
  duration,
  setDuration,
  aspectRatio,
  setAspectRatio,
  resolution,
  setResolution,
  hasAudio,
  setHasAudio,
  outputFormat = 'MP4',
  setOutputFormat,
  disabled = false,
}) => {
  const durations = [4, 5, 8, 10, 15, 20, 25, 30];

  const aspectRatios: { label: string; value: AspectRatio; sub: string }[] = [
    { label: '16:9', value: '16:9', sub: 'Landscape' },
    { label: '9:16', value: '9:16', sub: 'Portrait' },
    { label: '1:1', value: '1:1', sub: 'Square' },
    { label: '4:3', value: '4:3', sub: 'Standard' },
    { label: '3:4', value: '3:4', sub: 'Vertical' },
    { label: '21:9', value: '21:9', sub: 'Cinematic' },
  ];

  const resolutions: Resolution[] = ['480p', '720p', '1080p'];

  const estimatedCredits = duration * (resolution === '1080p' ? 2 : 1);

  return (
    <div className="bg-[#121217] border border-[#22222a] rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#22222a]">
        <h3 className="text-xs font-semibold text-zinc-300 tracking-wider uppercase">
          Seedance 2.5 Engine Settings
        </h3>
        <span className="text-[11px] font-mono tabular-nums text-purple-300">
          Estimated: <strong className="text-white font-bold">{estimatedCredits}</strong> Credits
        </span>
      </div>

      {/* Duration Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-zinc-400 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            Duration: <span className="text-zinc-100 font-bold ml-1">{duration} Seconds</span>
          </label>
          {duration === 30 && (
            <span className="text-[10px] text-purple-400 font-mono">Max supported (30s)</span>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {durations.map((d) => (
            <button
              key={d}
              type="button"
              disabled={disabled}
              onClick={() => setDuration(d)}
              className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all ${
                duration === d
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-[#181820] text-zinc-400 border-[#282833] hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          Aspect Ratio
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {aspectRatios.map((item) => (
            <button
              key={item.value}
              type="button"
              disabled={disabled}
              onClick={() => setAspectRatio(item.value)}
              className={`py-2 px-2 text-center rounded-lg border transition-all ${
                aspectRatio === item.value
                  ? 'bg-purple-600/15 border-purple-500 text-purple-300 font-semibold'
                  : 'bg-[#181820] text-zinc-400 border-[#282833] hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              <div className="text-xs font-mono font-bold">{item.label}</div>
              <div className="text-[10px] text-zinc-500 mt-0.5">{item.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Resolution Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-zinc-400 font-medium flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-zinc-400" />
            Output Quality
          </label>
          <span className="text-[10px] text-zinc-500 font-mono">
            {resolution === '1080p' ? '2 credits/sec' : '1 credit/sec'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {resolutions.map((res) => (
            <button
              key={res}
              type="button"
              disabled={disabled}
              onClick={() => setResolution(res)}
              className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                resolution === res
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-[#181820] text-zinc-400 border-[#282833] hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Audio and Format Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Audio Toggle */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setHasAudio(!hasAudio)}
          className={`py-2.5 px-3 rounded-lg border flex items-center justify-between text-xs font-medium transition-all ${
            hasAudio
              ? 'bg-purple-950/25 border-purple-500/40 text-purple-200'
              : 'bg-[#181820] border-[#282833] text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {hasAudio ? (
              <Volume2 className="w-4 h-4 text-purple-400 shrink-0" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500 shrink-0" />
            )}
            <div className="text-left">
              <div>Native Audio</div>
              <div className="text-[10px] text-zinc-500">
                {hasAudio ? 'Sound effects enabled' : 'Muted video'}
              </div>
            </div>
          </div>
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              hasAudio ? 'border-purple-400 bg-purple-500' : 'border-zinc-600'
            }`}
          >
            {hasAudio && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
        </button>

        {/* Output format */}
        <div className="py-2.5 px-3 rounded-lg bg-[#181820] border border-[#282833] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-zinc-400" />
            <div className="text-left">
              <div className="text-zinc-300 font-medium">Container Format</div>
              <div className="text-[10px] text-zinc-500">H.264 / AAC</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOutputFormat && setOutputFormat('MP4')}
              className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition ${
                outputFormat === 'MP4'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              MP4
            </button>
            <button
              type="button"
              onClick={() => setOutputFormat && setOutputFormat('MOV')}
              className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition ${
                outputFormat === 'MOV'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              MOV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
