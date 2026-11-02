import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { VideoPlayer } from '../shared/VideoPlayer';
import { GenerationRecord, GenerationType } from '../../types/index';
import {
  Trash2,
  Download,
  RotateCcw,
  Calendar,
  Clock,
  Search,
  Filter,
  Film,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { generations, deleteGeneration, startGenerationJob, setActiveTab } = useStudio();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<GenerationRecord | null>(null);

  const filteredGenerations = generations.filter((item) => {
    const matchesSearch =
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDownload = async (videoUrl: string, name: string) => {
    try {
      const res = await fetch(videoUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_seedance.mp4`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch {
      window.open(videoUrl, '_blank');
    }
  };

  const handleRegenerate = async (item: GenerationRecord) => {
    try {
      await startGenerationJob({
        type: item.type,
        prompt: item.prompt,
        negativePrompt: item.negativePrompt,
        duration: item.duration,
        aspectRatio: item.aspectRatio,
        resolution: item.resolution,
        hasAudio: item.hasAudio,
        firstFrameUrl: item.firstFrameUrl,
        lastFrameUrl: item.lastFrameUrl,
        referenceUrls: item.referenceUrls,
        sourceVideoUrl: item.sourceVideoUrl,
        projectName: `Re-run: ${item.projectName}`,
      });
      if (item.type === 'TEXT_TO_VIDEO') setActiveTab('text-to-video');
      else if (item.type === 'IMAGE_TO_VIDEO') setActiveTab('image-to-video');
      else if (item.type === 'REFERENCE_TO_VIDEO') setActiveTab('reference-to-video');
      else setActiveTab('video-to-video');
    } catch (err: any) {
      alert(`Could not regenerate: ${err.message}`);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#22222a]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Generations History
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review, stream, re-render, and export all generated video sequences.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="bg-[#181820] border border-[#2b2b36] rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 w-44 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#14141c] p-1 rounded-lg border border-[#252532]">
            {(['ALL', 'TEXT_TO_VIDEO', 'IMAGE_TO_VIDEO', 'REFERENCE_TO_VIDEO', 'VIDEO_TO_VIDEO'] as const).map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                    typeFilter === t
                      ? 'bg-purple-600 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {t === 'ALL'
                    ? 'All'
                    : t === 'TEXT_TO_VIDEO'
                    ? 'T2V'
                    : t === 'IMAGE_TO_VIDEO'
                    ? 'I2V'
                    : t === 'REFERENCE_TO_VIDEO'
                    ? 'Ref'
                    : 'V2V'}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Video Modal if an item is selected */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#2b2b36] rounded-2xl max-w-3xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base truncate max-w-lg">
                {selectedRecord.projectName}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-zinc-400 hover:text-white px-2 py-1"
              >
                Close ✕
              </button>
            </div>

            {selectedRecord.videoUrl ? (
              <VideoPlayer
                videoUrl={selectedRecord.videoUrl}
                thumbnailUrl={selectedRecord.thumbnailUrl}
                projectName={selectedRecord.projectName}
                aspectRatio={selectedRecord.aspectRatio}
                duration={selectedRecord.duration}
              />
            ) : (
              <div className="aspect-video bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 text-xs">
                Rendering in progress...
              </div>
            )}

            <p className="text-xs text-zinc-300 leading-relaxed bg-[#181820] p-3 rounded-lg border border-[#22222a]">
              {selectedRecord.prompt}
            </p>

            <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
              <div className="flex items-center gap-3">
                <span>{selectedRecord.duration}s</span>
                <span>·</span>
                <span>{selectedRecord.resolution}</span>
                <span>·</span>
                <span>{selectedRecord.aspectRatio}</span>
                <span>·</span>
                <span>{selectedRecord.hasAudio ? 'Audio Synced' : 'Muted'}</span>
              </div>

              {selectedRecord.videoUrl && (
                <button
                  onClick={() => handleDownload(selectedRecord.videoUrl!, selectedRecord.projectName)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download MP4
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid of Generations */}
      {filteredGenerations.length === 0 ? (
        <div className="py-20 text-center bg-[#121217] border border-[#22222a] rounded-xl text-zinc-500 text-xs space-y-2">
          <Film className="w-8 h-8 stroke-[1.5] text-zinc-600 mx-auto" />
          <p className="font-medium text-zinc-400">No Generation Records Found</p>
          <p className="text-zinc-600">Start a new video generation in any of the studio tools.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGenerations.map((item) => (
            <div
              key={item.id}
              className="bg-[#121217] border border-[#22222a] rounded-xl overflow-hidden flex flex-col justify-between group hover:border-[#353545] transition"
            >
              <div>
                {/* Media Preview Thumbnail / Player */}
                {item.videoUrl ? (
                  <div
                    onClick={() => setSelectedRecord(item)}
                    className="cursor-pointer relative aspect-video bg-black overflow-hidden group/media"
                  >
                    <img
                      src={item.thumbnailUrl || '/src/assets/images/sample_cyberpunk_city_1793608014217.jpg'}
                      alt={item.projectName}
                      className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover/media:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-purple-600/80 text-white flex items-center justify-center shadow-lg group-hover/media:scale-110 transition-transform">
                        ▶
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-black/80 px-1.5 py-0.5 rounded text-white">
                      {item.duration}s
                    </span>
                  </div>
                ) : (
                  <div className="aspect-video bg-[#181820] flex flex-col items-center justify-center text-zinc-500 text-xs gap-1.5">
                    {item.status === 'PROCESSING' || item.status === 'QUEUED' ? (
                      <>
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                        <span>Rendering in progress...</span>
                      </>
                    ) : item.status === 'FAILED' ? (
                      <>
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span>Generation Failed</span>
                      </>
                    ) : (
                      <span>Cancelled</span>
                    )}
                  </div>
                )}

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <h4 className="font-bold text-white truncate max-w-[190px]">
                      {item.projectName}
                    </h4>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
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
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-3 bg-[#15151c] border-t border-[#22222a] flex items-center justify-between text-xs">
                <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleRegenerate(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#22222f] transition"
                    title="Regenerate / Re-run"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {item.videoUrl && (
                    <button
                      onClick={() => handleDownload(item.videoUrl!, item.projectName)}
                      className="p-1.5 rounded-lg text-purple-400 hover:text-purple-300 hover:bg-purple-600/15 transition"
                      title="Download MP4"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => deleteGeneration(item.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
