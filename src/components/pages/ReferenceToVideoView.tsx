import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { GenerationSettingsPanel } from '../workspace/GenerationSettingsPanel';
import { VideoPlayer } from '../shared/VideoPlayer';
import { AspectRatio, Resolution, OutputFormat } from '../../types/index';
import {
  UploadCloud,
  X,
  Plus,
  Sparkles,
  Loader2,
  AlertCircle,
  Layers,
  CheckCircle2,
  FileVideo,
  Music
} from 'lucide-react';

interface RefItem {
  id: string;
  url: string;
  role: 'character' | 'style' | 'composition' | 'lighting';
  notes: string;
}

export const ReferenceToVideoView: React.FC = () => {
  const { startGenerationJob, activeJob, currentPlayingVideo, characters, credits } = useStudio();

  const [references, setReferences] = useState<RefItem[]>([
    {
      id: 'ref_1',
      url: '/src/assets/images/character_elena_portrait_1793608014221.jpg',
      role: 'character',
      notes: 'Preserve facial geometry and obsidian combat armor',
    },
    {
      id: 'ref_2',
      url: '/src/assets/images/sample_cyberpunk_city_1793608014217.jpg',
      role: 'composition',
      notes: 'Rain reflections and neo-tokyo neon lighting tone',
    },
  ]);

  const [prompt, setPrompt] = useState('Dynamic medium shot of Elena walking confidently through a wet neon-lit alleyway, volumetric steam rising from drainage grates, 35mm film lens');
  const [duration, setDuration] = useState<number>(30); // Default 30s
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [resolution, setResolution] = useState<Resolution>('720p');
  const [hasAudio, setHasAudio] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('MP4');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [latestVideo, setLatestVideo] = useState<{ url: string; prompt: string; ratio: AspectRatio; duration: number } | null>(null);

  const estimatedCost = duration * (resolution === '1080p' ? 2 : 1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (references.length >= 4) {
      setErrorMessage('Seedance 2.5 supports a maximum of 4 concurrent visual references.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newRef: RefItem = {
        id: `ref_${Date.now()}`,
        url: event.target?.result as string,
        role: 'style',
        notes: file.name.slice(0, 30),
      };
      setReferences([...references, newRef]);
    };
    reader.readAsDataURL(file);
  };

  const handleAddFromPreset = (imgUrl: string, name: string) => {
    if (references.length >= 4) {
      setErrorMessage('Seedance 2.5 supports a maximum of 4 concurrent visual references.');
      return;
    }
    setReferences([
      ...references,
      {
        id: `ref_${Date.now()}`,
        url: imgUrl,
        role: 'character',
        notes: `Reference character: ${name}`,
      },
    ]);
  };

  const removeRef = (id: string) => {
    setReferences(references.filter((r) => r.id !== id));
  };

  const updateRef = (id: string, updates: Partial<RefItem>) => {
    setReferences(references.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const handleGenerate = async () => {
    if (references.length === 0) {
      setErrorMessage('Please add at least one reference asset for Reference Mode.');
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const record = await startGenerationJob({
        type: 'REFERENCE_TO_VIDEO',
        prompt,
        referenceUrls: references.map((r) => r.url),
        referenceInstructions: references.map((r) => `[${r.role.toUpperCase()}]: ${r.notes}`),
        duration,
        aspectRatio,
        resolution,
        hasAudio,
        outputFormat,
        projectName: 'Reference Synthesis',
      });

      setLatestVideo({
        url: record.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        prompt,
        ratio: aspectRatio,
        duration,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Reference video generation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentJobRendering = activeJob && activeJob.type === 'REFERENCE_TO_VIDEO';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Reference-to-Video Studio
          </h1>
          <span className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-semibold">
            Seedance 2.5 ref2v
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Lock character likeness, composition, and visual lighting by binding up to 4 multi-modal reference assets.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: References & prompts */}
        <div className="lg:col-span-7 space-y-5">
          {/* Reference Assets Shelf */}
          <div className="bg-[#121217] border border-[#22222a] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#22222a]">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Reference Assets ({references.length} / 4 limit)
              </span>
              <label className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium cursor-pointer transition">
                <Plus className="w-3.5 h-3.5" /> Add Image Reference
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={references.length >= 4}
                />
              </label>
            </div>

            {/* Quick insert from character library */}
            {characters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-zinc-500 text-[11px]">Insert from Character Presets:</span>
                {characters.map((char) => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => handleAddFromPreset(char.referenceImages[0], char.name)}
                    disabled={references.length >= 4}
                    className="px-2 py-0.5 rounded bg-[#181820] hover:bg-[#22222e] border border-[#2b2b38] text-purple-300 text-[11px] font-mono transition disabled:opacity-40"
                  >
                    + {char.name}
                  </button>
                ))}
              </div>
            )}

            {/* Reference cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {references.map((ref) => (
                <div
                  key={ref.id}
                  className="bg-[#181820] border border-[#2b2b36] rounded-lg p-3 flex gap-3 relative group"
                >
                  <img
                    src={ref.url}
                    alt="Reference item"
                    className="w-16 h-16 rounded-md object-cover border border-[#333342] shrink-0"
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <select
                      value={ref.role}
                      onChange={(e) => updateRef(ref.id, { role: e.target.value as any })}
                      className="w-full bg-[#121217] border border-[#2c2c3a] text-zinc-300 text-[11px] rounded px-1.5 py-0.5 focus:outline-none"
                    >
                      <option value="character">Character Identity</option>
                      <option value="style">Aesthetic & Lighting</option>
                      <option value="composition">Camera Framing</option>
                      <option value="lighting">Color Tone</option>
                    </select>
                    <input
                      type="text"
                      value={ref.notes}
                      onChange={(e) => updateRef(ref.id, { notes: e.target.value })}
                      placeholder="Guidance instruction..."
                      className="w-full bg-[#121217] border border-[#2c2c3a] text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => removeRef(ref.id)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 hover:bg-red-600 text-zinc-400 hover:text-white transition"
                    title="Remove reference"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Integrated prompt */}
          <div className="bg-[#121217] border border-[#22222a] rounded-xl p-5 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block">
              Multi-Reference Synthesis Prompt
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe scene action while instructing how the references merge..."
              className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition resize-none leading-relaxed"
            />
          </div>

          <GenerationSettingsPanel
            duration={duration}
            setDuration={setDuration}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            resolution={resolution}
            setResolution={setResolution}
            hasAudio={hasAudio}
            setHasAudio={setHasAudio}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            disabled={isSubmitting || !!isCurrentJobRendering}
          />

          <button
            type="button"
            disabled={isSubmitting || !!isCurrentJobRendering || references.length === 0 || credits < estimatedCost}
            onClick={handleGenerate}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-white shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isCurrentJobRendering ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Synthesizing Reference Sequence ({activeJob?.progress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Video with References ({estimatedCost} Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right column: Viewport */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#121217] border border-[#22222a] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#22222a]">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Production Viewport
              </h3>
              {latestVideo && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Render Ready
                </span>
              )}
            </div>

            {isCurrentJobRendering ? (
              <div className="aspect-video rounded-xl bg-[#181820] border border-[#2b2b36] flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <Sparkles className="w-6 h-6 text-purple-400 absolute inset-0 m-auto" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Seedance 2.5 In Progress</h4>
                  <p className="text-xs text-purple-300 max-w-xs">{activeJob?.stageText}</p>
                </div>
                <div className="w-full max-w-xs bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full transition-all duration-300"
                    style={{ width: `${activeJob?.progress || 10}%` }}
                  />
                </div>
              </div>
            ) : latestVideo || currentPlayingVideo ? (
              <div className="space-y-3">
                <VideoPlayer
                  videoUrl={latestVideo?.url || currentPlayingVideo?.videoUrl || ''}
                  projectName="reference_synthesis"
                  aspectRatio={latestVideo?.ratio || currentPlayingVideo?.aspectRatio || aspectRatio}
                  duration={latestVideo?.duration || currentPlayingVideo?.duration || duration}
                />
                <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {latestVideo?.prompt || currentPlayingVideo?.prompt}
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-xl border-2 border-dashed border-[#2b2b36] flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
                <Layers className="w-8 h-8 stroke-[1.5] text-zinc-600" />
                <p className="text-xs font-semibold text-zinc-400">Reference Mode Viewport</p>
                <p className="text-[11px] text-zinc-600 max-w-xs">
                  Attach character or aesthetic references to ensure strong fidelity during 30s rendering.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
