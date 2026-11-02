import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { PromptEditor } from '../workspace/PromptEditor';
import { GenerationSettingsPanel } from '../workspace/GenerationSettingsPanel';
import { VideoPlayer } from '../shared/VideoPlayer';
import { AspectRatio, Resolution, OutputFormat } from '../../types/index';
import { Sparkles, Loader2, AlertCircle, Film, RefreshCw, CheckCircle2 } from 'lucide-react';

export const TextToVideoView: React.FC = () => {
  const { startGenerationJob, activeJob, currentPlayingVideo, credits } = useStudio();

  const [prompt, setPrompt] = useState(
    'A high-tech cinematic camera tracking a lone astronaut wandering across the crystalline dunes of an alien exoplanet under dual binary suns, volumetric dust rays, 35mm film still, ultra-detailed'
  );
  const [negativePrompt, setNegativePrompt] = useState('blurry, distorted, low quality, artifacts, cartoonish, oversaturated');
  const [duration, setDuration] = useState<number>(30); // Default 30s as specified
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9'); // Default 16:9
  const [resolution, setResolution] = useState<Resolution>('720p'); // Default 720p
  const [hasAudio, setHasAudio] = useState(true); // Default Enabled
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('MP4');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [latestVideo, setLatestVideo] = useState<{ url: string; prompt: string; ratio: AspectRatio; duration: number } | null>(null);

  const estimatedCost = duration * (resolution === '1080p' ? 2 : 1);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Please enter a descriptive prompt for the scene.');
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const record = await startGenerationJob({
        type: 'TEXT_TO_VIDEO',
        prompt,
        negativePrompt,
        duration,
        aspectRatio,
        resolution,
        hasAudio,
        outputFormat,
        projectName: prompt.slice(0, 30),
      });

      // Poll will fulfill completed record into context
      setLatestVideo({
        url: record.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        prompt,
        ratio: aspectRatio,
        duration,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to start generation job.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentJobRendering = activeJob && activeJob.type === 'TEXT_TO_VIDEO';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Text-to-Video Studio
          </h1>
          <span className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-semibold">
            Seedance 2.5
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Synthesize up to 30-second fluid cinematic sequences with temporal continuity and native multi-channel audio synthesis.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid: Left Workspace & Right Production Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input and Settings */}
        <div className="lg:col-span-7 space-y-5">
          <PromptEditor
            prompt={prompt}
            setPrompt={setPrompt}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            disabled={isSubmitting || !!isCurrentJobRendering}
          />

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

          {/* Generate Button */}
          <button
            type="button"
            disabled={isSubmitting || !!isCurrentJobRendering || !prompt.trim() || credits < estimatedCost}
            onClick={handleGenerate}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-white shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isCurrentJobRendering ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Synthesizing Sequence ({activeJob?.progress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate {duration}s Video ({estimatedCost} Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Viewport */}
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
                  projectName={latestVideo?.prompt.slice(0, 20) || currentPlayingVideo?.projectName}
                  aspectRatio={latestVideo?.ratio || currentPlayingVideo?.aspectRatio || aspectRatio}
                  duration={latestVideo?.duration || currentPlayingVideo?.duration || duration}
                />
                <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {latestVideo?.prompt || currentPlayingVideo?.prompt}
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-xl border-2 border-dashed border-[#2b2b36] flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
                <Film className="w-8 h-8 stroke-[1.5] text-zinc-600" />
                <p className="text-xs font-semibold text-zinc-400">Viewport Idle</p>
                <p className="text-[11px] text-zinc-600 max-w-xs">
                  Configure duration (default 30s), aspect ratio, and prompt, then click Generate to initialize Seedance 2.5 video synthesis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
