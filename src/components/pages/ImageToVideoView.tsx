import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { GenerationSettingsPanel } from '../workspace/GenerationSettingsPanel';
import { VideoPlayer } from '../shared/VideoPlayer';
import { AspectRatio, Resolution, OutputFormat } from '../../types/index';
import {
  UploadCloud,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  CheckCircle2,
  Wand2
} from 'lucide-react';

const SAMPLE_KEYFRAMES = [
  {
    name: 'Elena Cyberpunk (Sample)',
    url: '/src/assets/images/character_elena_portrait_1793608014221.jpg',
  },
  {
    name: 'Commander Marcus (Sample)',
    url: '/src/assets/images/character_marcus_portrait_1793608013038.jpg',
  },
  {
    name: 'Neo-Tokyo City (Sample)',
    url: '/src/assets/images/sample_cyberpunk_city_1793608014217.jpg',
  },
];

export const ImageToVideoView: React.FC = () => {
  const { startGenerationJob, activeJob, currentPlayingVideo, credits } = useStudio();

  const [firstFrameUrl, setFirstFrameUrl] = useState<string | null>(SAMPLE_KEYFRAMES[0].url);
  const [lastFrameUrl, setLastFrameUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Smooth cinematic camera panning, wind gently moving fabric, natural volumetric lighting transition, high frame rate photorealistic motion');
  const [duration, setDuration] = useState<number>(30); // Default 30s
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [resolution, setResolution] = useState<Resolution>('720p');
  const [hasAudio, setHasAudio] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('MP4');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [latestVideo, setLatestVideo] = useState<{ url: string; prompt: string; ratio: AspectRatio; duration: number } | null>(null);

  const estimatedCost = duration * (resolution === '1080p' ? 2 : 1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, role: 'first' | 'last') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (role === 'first') setFirstFrameUrl(event.target?.result as string);
      if (role === 'last') setLastFrameUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!firstFrameUrl) {
      setErrorMessage('Please upload or select at least a First Frame keyframe to animate.');
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const record = await startGenerationJob({
        type: 'IMAGE_TO_VIDEO',
        prompt: prompt || 'Realistic smooth cinematic animation and motion',
        firstFrameUrl,
        lastFrameUrl: lastFrameUrl || undefined,
        duration,
        aspectRatio,
        resolution,
        hasAudio,
        outputFormat,
        projectName: 'I2V Sequence',
      });

      setLatestVideo({
        url: record.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        prompt,
        ratio: aspectRatio,
        duration,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Image-to-Video generation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentJobRendering = activeJob && activeJob.type === 'IMAGE_TO_VIDEO';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Image-to-Video Animator
          </h1>
          <span className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-semibold">
            Seedance 2.5 i2v
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Animate static keyframes into fluid, 30-second temporal motion with optional start-to-end frame interpolation.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Keyframe inputs & settings */}
        <div className="lg:col-span-7 space-y-5">
          {/* Keyframe Uploaders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Frame (Mandatory) */}
            <div className="bg-[#121217] border border-[#22222a] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
                  First Frame (Required)
                </span>
                <span className="text-[10px] text-purple-400 font-mono">Start pose</span>
              </div>

              {firstFrameUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-[#2b2b36] aspect-video group bg-black">
                  <img
                    src={firstFrameUrl}
                    alt="First frame keyframe"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold cursor-pointer">
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'first')}
                      />
                    </label>
                    <button
                      onClick={() => setFirstFrameUrl(null)}
                      className="p-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-xs"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#282834] hover:border-purple-500/50 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer transition p-4 text-center group">
                  <UploadCloud className="w-7 h-7 text-zinc-500 group-hover:text-purple-400 mb-1 transition" />
                  <span className="text-xs text-zinc-300 font-medium">Upload Keyframe</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">PNG, JPG, WebP up to 30MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'first')}
                  />
                </label>
              )}
            </div>

            {/* Last Frame (Optional) */}
            <div className="bg-[#121217] border border-[#22222a] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
                  Last Frame (Optional)
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">End target</span>
              </div>

              {lastFrameUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-[#2b2b36] aspect-video group bg-black">
                  <img
                    src={lastFrameUrl}
                    alt="Last frame keyframe"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold cursor-pointer">
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'last')}
                      />
                    </label>
                    <button
                      onClick={() => setLastFrameUrl(null)}
                      className="p-1 rounded bg-red-600/80 hover:bg-red-600 text-white text-xs"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-[#282834] hover:border-purple-500/50 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer transition p-4 text-center group">
                  <UploadCloud className="w-7 h-7 text-zinc-500 group-hover:text-purple-400 mb-1 transition" />
                  <span className="text-xs text-zinc-300 font-medium">Add Ending Frame</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">Interpolates smooth transition</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'last')}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Quick presets picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-500">Quick sample frames:</span>
            {SAMPLE_KEYFRAMES.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => setFirstFrameUrl(sample.url)}
                className="px-2.5 py-1 rounded-lg bg-[#181820] hover:bg-[#20202a] border border-[#2b2b36] text-[11px] text-zinc-300 hover:text-white transition"
              >
                {sample.name}
              </button>
            ))}
          </div>

          {/* Motion direction prompt */}
          <div className="bg-[#121217] border border-[#22222a] rounded-xl p-5 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block">
              Motion Guidance & Camera Trajectory
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Subject looks toward camera, eyes blink naturally, camera slowly arcs clockwise..."
              className="w-full bg-[#181820] border border-[#2b2b36] rounded-lg p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition"
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
            disabled={isSubmitting || !!isCurrentJobRendering || !firstFrameUrl || credits < estimatedCost}
            onClick={handleGenerate}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-white shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isCurrentJobRendering ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Synthesizing Animation ({activeJob?.progress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Animate Keyframe into {duration}s Video ({estimatedCost} Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right column: Production Viewport */}
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
                  projectName="i2v_animation"
                  aspectRatio={latestVideo?.ratio || currentPlayingVideo?.aspectRatio || aspectRatio}
                  duration={latestVideo?.duration || currentPlayingVideo?.duration || duration}
                />
                <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {latestVideo?.prompt || currentPlayingVideo?.prompt}
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-xl border-2 border-dashed border-[#2b2b36] flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
                <ImageIcon className="w-8 h-8 stroke-[1.5] text-zinc-600" />
                <p className="text-xs font-semibold text-zinc-400">Awaiting Keyframes</p>
                <p className="text-[11px] text-zinc-600 max-w-xs">
                  Upload a primary start frame to synthesize camera trajectory and temporal animation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
