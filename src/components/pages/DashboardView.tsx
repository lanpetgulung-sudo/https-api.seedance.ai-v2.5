import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { VideoPlayer } from '../shared/VideoPlayer';
import {
  Film,
  Image as ImageIcon,
  Layers,
  RefreshCw,
  Coins,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { generations, credits, setActiveTab, setCurrentPlayingVideo, activeJob } = useStudio();

  const totalVideos = generations.filter((g) => g.status === 'SUCCEEDED').length;
  const recentGenerations = generations.slice(0, 4);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome & Model Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#13121f] to-[#0f0f15] border border-purple-500/20 p-6 lg:p-8 overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
              Seedance 2.5 Architecture
            </span>
            <span className="text-xs text-zinc-400">·</span>
            <span className="text-xs text-zinc-400">Diffusion Transformer (DiT)</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Cinematic AI Video Generation Studio
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed">
            Generate long-form fluid animations up to <strong className="text-white">30 seconds</strong> with native multi-channel audio synthesis, character facial consistency, and high-fidelity camera control.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('text-to-video')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition transform hover:-translate-y-0.5"
            >
              <Film className="w-4 h-4" />
              <span>Launch Text-to-Video (30s)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('image-to-video')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1c1c24] hover:bg-[#252532] text-zinc-200 text-xs font-semibold border border-[#2d2d3c] transition"
            >
              <ImageIcon className="w-4 h-4 text-purple-400" />
              <span>Animate Keyframe Image</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121217] border border-[#22222a] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Completed Videos</span>
            <Film className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {totalVideos}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">Archive preserved</div>
        </div>

        <div className="bg-[#121217] border border-[#22222a] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Studio Credits</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {credits}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">~{Math.floor(credits / 30)} full 30s clips</div>
        </div>

        <div className="bg-[#121217] border border-[#22222a] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Max Duration</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            30s
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">Up to 60fps output</div>
        </div>

        <div className="bg-[#121217] border border-[#22222a] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Pipeline Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {activeJob ? 'Rendering Job' : 'Ready for Ingest'}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">Cluster nominal</div>
        </div>
      </div>

      {/* Generation Mode Selectors Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
          Creation Studios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('text-to-video')}
            className="text-left bg-[#121217] hover:bg-[#16161e] border border-[#22222a] hover:border-purple-500/40 rounded-xl p-5 transition group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                Text-to-Video
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Generate 4 to 30 second photorealistic scenes from natural language prompts with camera direction.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('image-to-video')}
            className="text-left bg-[#121217] hover:bg-[#16161e] border border-[#22222a] hover:border-purple-500/40 rounded-xl p-5 transition group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                Image-to-Video
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Animate static images, art, and concept renderings with keyframe start and ending targets.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('reference-to-video')}
            className="text-left bg-[#121217] hover:bg-[#16161e] border border-[#22222a] hover:border-purple-500/40 rounded-xl p-5 transition group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                Reference Mode
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Combine multiple character images, style references, and audio cues for cohesive visual output.
              </p>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('video-to-video')}
            className="text-left bg-[#121217] hover:bg-[#16161e] border border-[#22222a] hover:border-purple-500/40 rounded-xl p-5 transition group space-y-3"
          >
            <div className="w-10 h-10 rounded-lg bg-pink-600/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
                Video-to-Video
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Upload existing video clips to transform visual style, lighting, environment, or cinematic genre.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Generations Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            Recent Production Runs
          </h2>
          <button
            onClick={() => setActiveTab('history')}
            className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition"
          >
            <span>View All ({generations.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentGenerations.length === 0 ? (
          <div className="p-8 text-center bg-[#121217] border border-[#22222a] rounded-xl text-zinc-500 text-xs">
            No videos generated yet. Launch Text-to-Video to begin.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {recentGenerations.map((item) => (
              <div
                key={item.id}
                className="bg-[#121217] border border-[#22222a] rounded-xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {item.videoUrl ? (
                    <VideoPlayer
                      videoUrl={item.videoUrl}
                      thumbnailUrl={item.thumbnailUrl}
                      projectName={item.projectName}
                      aspectRatio={item.aspectRatio}
                      duration={item.duration}
                    />
                  ) : (
                    <div className="aspect-video bg-[#181820] flex items-center justify-center text-zinc-500 text-xs font-mono">
                      Processing video...
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate max-w-[200px]">
                        {item.projectName}
                      </span>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {item.type.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono pt-1">
                      <span>{item.duration}s</span>
                      <span>·</span>
                      <span>{item.resolution}</span>
                      <span>·</span>
                      <span>{item.aspectRatio}</span>
                      <span>·</span>
                      <span>{item.hasAudio ? 'Audio Synced' : 'Muted'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
