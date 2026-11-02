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
  RefreshCw,
  CheckCircle2,
  Film
} from 'lucide-react';

const SAMPLE_SOURCE_VIDEOS = [
  {
    name: 'Camera Dolly Sample',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    name: 'Action Sequence Sample',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  },
];

export const VideoToVideoView: React.FC = () => {
  const { startGenerationJob, activeJob, currentPlayingVideo, credits } = useStudio();

  const [sourceVideoUrl, setSourceVideoUrl] = useState<string>(SAMPLE_SOURCE_VIDEOS[0].url);
  const [prompt, setPrompt] = useState('Transform into an anime cyber-aesthetic style with vibrant cel-shaded edges, luminous neon glow, dynamic rain streaks, cinematic high contrast');
  const [duration, setDuration] = useState<number>(15);
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

    if (!file.type.startsWith('video/')) {
      setErrorMessage('Please upload a valid MP4 or WebM video file.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSourceVideoUrl(objectUrl);
  };

  const handleGenerate = async () => {
    if (!sourceVideoUrl) {
      setErrorMessage('Please select or upload an input video clip to transform.');
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const record = await startGenerationJob({
        type: 'VIDEO_TO_VIDEO',
        prompt,
        sourceVideoUrl,
        duration,
        aspectRatio,
        resolution,
        hasAudio,
        outputFormat,
        projectName: 'Video-to-Video Transformation',
      });

      setLatestVideo({
        url: record.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        prompt,
        ratio: aspectRatio,
        duration,
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Video transformation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentJobRendering = activeJob && activeJob.type === 'VIDEO_TO_VIDEO';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Video-to-Video Transformation
          </h1>
          <span className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-semibold">
            Seedance 2.5 v2v
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Restyle existing motion trajectories into new cinematic genres, textures, atmospheres, or animation styles.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Source video & instructions */}
        <div className="lg:col-span-7 space-y-5">
          {/* Source video selection */}
          <div className="bg-[#121217] border border-[#22222a] rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#22222a]">
              <span className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px]">
                Input Source Video
              </span>
              <label className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium">
                Upload New Video
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {sourceVideoUrl && (
              <div className="rounded-lg overflow-hidden border border-[#2b2b36] aspect-video bg-black max-h-56">
                <video
                  src={sourceVideoUrl}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-zinc-500 text-[11px]">Sample clips:</span>
              {SAMPLE_SOURCE_VIDEOS.map((sample) => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => setSourceVideoUrl(sample.url)}
                  className="px-2.5 py-1 rounded bg-[#181820] hover:bg-[#20202a] border border-[#2b2b36] text-[11px] text-zinc-300 hover:text-white transition"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>

          {/* Transformation prompt */}
          <div className="bg-[#121217] border border-[#22222a] rounded-xl p-5 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block">
              Style Transformation Prompt
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the target aesthetic, lighting, lens, or thematic genre..."
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
            disabled={isSubmitting || !!isCurrentJobRendering || !sourceVideoUrl || credits < estimatedCost}
            onClick={handleGenerate}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-white shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isCurrentJobRendering ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Transforming Video Sequence ({activeJob?.progress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Transform Video ({estimatedCost} Credits)</span>
              </>
            )}
          </button>
        </div>

        {/* Right column: Output viewport */}
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
                  projectName="video_transformed"
                  aspectRatio={latestVideo?.ratio || currentPlayingVideo?.aspectRatio || aspectRatio}
                  duration={latestVideo?.duration || currentPlayingVideo?.duration || duration}
                />
                <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {latestVideo?.prompt || currentPlayingVideo?.prompt}
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-xl border-2 border-dashed border-[#2b2b36] flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
                <RefreshCw className="w-8 h-8 stroke-[1.5] text-zinc-600" />
                <p className="text-xs font-semibold text-zinc-400">Awaiting Video Input</p>
                <p className="text-[11px] text-zinc-600 max-w-xs">
                  Upload an input video clip to transform motion vectors into a new visual style.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
