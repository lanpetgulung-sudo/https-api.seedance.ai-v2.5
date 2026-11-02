import {
  IVideoProvider,
  VideoGenerationParams,
  ProviderTaskResponse,
  ProviderPollResponse,
  Resolution
} from '../../types/index';

interface MockJob {
  id: string;
  params: VideoGenerationParams;
  startTime: number;
  totalDurationMs: number;
  videoUrl: string;
  thumbnailUrl: string;
}

// In-memory job registry for realistic simulation
const mockJobRegistry = new Map<string, MockJob>();

// Curated high quality demo videos for simulation
const DEMO_VIDEOS = [
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: '/src/assets/images/sample_cyberpunk_city_1793608014217.jpg',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: '/src/assets/images/character_elena_portrait_1793608014221.jpg',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/src/assets/images/character_marcus_portrait_1793608013038.jpg',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: '/src/assets/images/sample_cyberpunk_city_1793608014217.jpg',
  },
];

export class MockSeedanceProvider implements IVideoProvider {
  public name = 'Mock Seedance 2.5 (Simulation)';
  public isMock = true;

  public calculateCost(duration: number, resolution: Resolution): number {
    const basePerSecond = resolution === '1080p' ? 2 : 1;
    return Math.max(1, Math.ceil(duration * basePerSecond));
  }

  private registerJob(params: VideoGenerationParams): ProviderTaskResponse {
    const taskId = `seedance_sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    
    // Choose video based on prompt or input
    const demoIndex = Math.abs(params.prompt.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % DEMO_VIDEOS.length;
    const selectedDemo = DEMO_VIDEOS[demoIndex];

    // Simulated render time: roughly 8 to 14 seconds for realistic feel without making the user wait indefinitely
    const renderDurationMs = Math.min(18000, Math.max(8000, params.duration * 400));

    mockJobRegistry.set(taskId, {
      id: taskId,
      params,
      startTime: Date.now(),
      totalDurationMs: renderDurationMs,
      videoUrl: selectedDemo.videoUrl,
      thumbnailUrl: params.firstFrameUrl || selectedDemo.thumbnailUrl,
    });

    return {
      taskId,
      status: 'QUEUED',
      estimatedWaitTime: Math.ceil(renderDurationMs / 1000),
    };
  }

  public async generateTextToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse> {
    return this.registerJob(params);
  }

  public async generateImageToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse> {
    return this.registerJob(params);
  }

  public async generateReferenceToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse> {
    return this.registerJob(params);
  }

  public async generateVideoToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse> {
    return this.registerJob(params);
  }

  public async checkStatus(taskId: string): Promise<ProviderPollResponse> {
    const job = mockJobRegistry.get(taskId);
    if (!job) {
      return {
        status: 'FAILED',
        progress: 0,
        errorMessage: 'Task identifier not found in simulation memory. It may have expired.',
      };
    }

    const elapsed = Date.now() - job.startTime;
    const rawProgress = Math.min(100, Math.floor((elapsed / job.totalDurationMs) * 100));

    let stageText = 'Queued in Seedance GPU cluster...';
    if (rawProgress > 0 && rawProgress <= 20) {
      stageText = 'Allocating Seedance Tensor Node & Tokenizing Prompt...';
    } else if (rawProgress > 20 && rawProgress <= 50) {
      stageText = 'Synthesizing 3D Latent Motion Fields & Trajectory...';
    } else if (rawProgress > 50 && rawProgress <= 75) {
      stageText = `Interpolating Temporal Frame Consistency (${job.params.duration}s)...`;
    } else if (rawProgress > 75 && rawProgress < 95) {
      stageText = job.params.hasAudio
        ? 'Synthesizing Native Multi-Channel Spatial Audio...'
        : 'Optimizing Color Timing & Motion Blur...';
    } else if (rawProgress >= 95 && rawProgress < 100) {
      stageText = 'Packaging Final High-Bitrate MP4 Stream...';
    } else {
      stageText = 'Video Ready!';
    }

    if (rawProgress >= 100) {
      return {
        status: 'SUCCEEDED',
        progress: 100,
        stageText: 'Generation Complete',
        videoUrl: job.videoUrl,
        thumbnailUrl: job.thumbnailUrl,
        seed: Math.floor(Math.random() * 99999999),
      };
    }

    return {
      status: 'PROCESSING',
      progress: Math.max(4, rawProgress),
      stageText,
    };
  }

  public async downloadGeneratedVideo(videoUrl: string, filename: string): Promise<void> {
    try {
      const res = await fetch(videoUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename.endsWith('.mp4') ? filename : `${filename}.mp4`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch {
      window.open(videoUrl, '_blank');
    }
  }
}
