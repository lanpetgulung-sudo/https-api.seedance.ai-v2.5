import {
  IVideoProvider,
  VideoGenerationParams,
  ProviderTaskResponse,
  ProviderPollResponse,
  Resolution
} from '../../types/index';

/**
 * Production Seedance 2.5 Provider Client
 * Communicates with the authorized Seedance API endpoints.
 */
export class SeedanceProvider implements IVideoProvider {
  public name = 'Seedance 2.5 Live';
  public isMock = false;
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || (typeof process !== 'undefined' ? process.env?.SEEDANCE_API_KEY || '' : '');
    this.baseUrl = baseUrl || (typeof process !== 'undefined' ? process.env?.SEEDANCE_API_BASE_URL || 'https://api.seedance.ai/v2.5' : 'https://api.seedance.ai/v2.5');
  }

  public calculateCost(duration: number, resolution: Resolution): number {
    const basePerSecond = resolution === '1080p' ? 2 : 1;
    return Math.max(1, Math.ceil(duration * basePerSecond));
  }

  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    if (!this.apiKey) {
      throw new Error('Seedance API Key is required. Please configure it in Studio Settings or switch to Simulation Mode.');
    }

    const url = `${this.baseUrl.replace(/\/+$/, '')}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      let errMsg = response.statusText;
      try {
        const errorPayload = await response.json();
        errMsg = errorPayload.message || errorPayload.error || JSON.stringify(errorPayload);
      } catch {
        // use status text
      }
      throw new Error(`Seedance API Error [${response.status}]: ${errMsg}`);
    }

    return response.json() as Promise<T>;
  }

  public async generateTextToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse> {
    const payload = {
      model: 'seedance-2.5-t2v',
      prompt: params.prompt,
      negative_prompt: params.negativePrompt,
      duration_seconds: params.duration,
      aspect_ratio: params.aspectRatio,
      resolution: params.resolution,
      enable_audio: params.hasAudio,
      output_format: params.outputFormat || 'MP4',
      callback_url: params.webhookUrl,
    };

    const res = await this.request<{ task_id: string; status: string; wait_seconds?: number }>('/tasks/text-to-video', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      taskId: res.task_id,
      status: 'QUEUED',
      estimatedWaitTime: res.wait_seconds || Math.round(params.duration * 1.5),
    };
  }

  public async generateImageToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse> {
    if (!params.firstFrameUrl) {
      throw new Error('Image-to-Video requires a primary first-frame image URL or base64 data.');
    }

    const payload = {
      model: 'seedance-2.5-i2v',
      prompt: params.prompt,
      image_url: params.firstFrameUrl,
      last_image_url: params.lastFrameUrl || undefined,
      duration_seconds: params.duration,
      aspect_ratio: params.aspectRatio,
      resolution: params.resolution,
      enable_audio: params.hasAudio,
      output_format: params.outputFormat || 'MP4',
      callback_url: params.webhookUrl,
    };

    const res = await this.request<{ task_id: string; status: string; wait_seconds?: number }>('/tasks/image-to-video', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      taskId: res.task_id,
      status: 'QUEUED',
      estimatedWaitTime: res.wait_seconds || Math.round(params.duration * 1.8),
    };
  }

  public async generateReferenceToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse> {
    if (!params.referenceUrls || params.referenceUrls.length === 0) {
      throw new Error('Reference-to-Video requires at least one reference asset URL.');
    }

    const payload = {
      model: 'seedance-2.5-ref2v',
      prompt: params.prompt,
      reference_images: params.referenceUrls,
      reference_instructions: params.referenceInstructions || [],
      duration_seconds: params.duration,
      aspect_ratio: params.aspectRatio,
      resolution: params.resolution,
      enable_audio: params.hasAudio,
      output_format: params.outputFormat || 'MP4',
      callback_url: params.webhookUrl,
    };

    const res = await this.request<{ task_id: string; status: string; wait_seconds?: number }>('/tasks/reference-to-video', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      taskId: res.task_id,
      status: 'QUEUED',
      estimatedWaitTime: res.wait_seconds || Math.round(params.duration * 2),
    };
  }

  public async generateVideoToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse> {
    if (!params.sourceVideoUrl) {
      throw new Error('Video-to-Video requires a source input video URL.');
    }

    const payload = {
      model: 'seedance-2.5-v2v',
      prompt: params.prompt,
      video_url: params.sourceVideoUrl,
      duration_seconds: params.duration,
      resolution: params.resolution,
      enable_audio: params.hasAudio,
      output_format: params.outputFormat || 'MP4',
      callback_url: params.webhookUrl,
    };

    const res = await this.request<{ task_id: string; status: string; wait_seconds?: number }>('/tasks/video-to-video', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      taskId: res.task_id,
      status: 'QUEUED',
      estimatedWaitTime: res.wait_seconds || Math.round(params.duration * 2),
    };
  }

  public async checkStatus(taskId: string): Promise<ProviderPollResponse> {
    const res = await this.request<{
      status: 'pending' | 'queued' | 'processing' | 'succeeded' | 'failed' | 'cancelled';
      progress: number;
      stage?: string;
      output?: { video_url?: string; thumbnail_url?: string; seed?: number };
      error?: string;
    }>(`/tasks/${taskId}`, { method: 'GET' });

    const statusMap: Record<string, ProviderPollResponse['status']> = {
      pending: 'QUEUED',
      queued: 'QUEUED',
      processing: 'PROCESSING',
      succeeded: 'SUCCEEDED',
      failed: 'FAILED',
      cancelled: 'CANCELLED',
    };

    return {
      status: statusMap[res.status] || 'PROCESSING',
      progress: res.progress || 0,
      stageText: res.stage || 'Rendering frames with Seedance 2.5...',
      videoUrl: res.output?.video_url,
      thumbnailUrl: res.output?.thumbnail_url,
      errorMessage: res.error,
      seed: res.output?.seed,
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
