export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4' | '21:9';
export type Resolution = '480p' | '720p' | '1080p';
export type OutputFormat = 'MP4' | 'MOV';
export type GenerationType = 'TEXT_TO_VIDEO' | 'IMAGE_TO_VIDEO' | 'REFERENCE_TO_VIDEO' | 'VIDEO_TO_VIDEO';
export type GenerationStatus = 'QUEUED' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';

export interface VideoGenerationParams {
  type: GenerationType;
  prompt: string;
  negativePrompt?: string;
  duration: number; // 4, 5, 8, 10, 15, 20, 25, 30
  aspectRatio: AspectRatio;
  resolution: Resolution;
  hasAudio: boolean;
  outputFormat?: OutputFormat;
  firstFrameUrl?: string;
  lastFrameUrl?: string;
  referenceUrls?: string[];
  referenceInstructions?: string[];
  sourceVideoUrl?: string;
  projectName?: string;
  webhookUrl?: string;
}

export interface ProviderTaskResponse {
  taskId: string;
  status: GenerationStatus;
  estimatedWaitTime?: number;
}

export interface ProviderPollResponse {
  status: GenerationStatus;
  progress: number; // 0 to 100
  stageText?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
  seed?: number;
}

export interface IVideoProvider {
  name: string;
  isMock: boolean;
  generateTextToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse>;
  generateImageToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse>;
  generateReferenceToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse>;
  generateVideoToVideo(params: VideoGenerationParams): Promise<ProviderTaskResponse>;
  checkStatus(taskId: string): Promise<ProviderPollResponse>;
  calculateCost(duration: number, resolution: Resolution): number;
  downloadGeneratedVideo(videoUrl: string, filename: string): Promise<void>;
}

export interface GenerationRecord {
  id: string;
  projectId?: string;
  projectName: string;
  type: GenerationType;
  provider: string;
  model: string;
  providerTaskId?: string;
  prompt: string;
  negativePrompt?: string;
  duration: number;
  resolution: Resolution;
  aspectRatio: AspectRatio;
  hasAudio: boolean;
  status: GenerationStatus;
  videoUrl?: string;
  thumbnailUrl?: string;
  errorMessage?: string;
  actualCost: number;
  firstFrameUrl?: string;
  lastFrameUrl?: string;
  referenceUrls?: string[];
  sourceVideoUrl?: string;
  createdAt: string;
  completedAt?: string;
}

export interface CharacterPreset {
  id: string;
  name: string;
  triggerTag: string;
  description: string;
  gender?: string;
  styleTags: string[];
  referenceImages: string[];
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  generationId?: string;
  type: 'DEDUCTION' | 'REFUND' | 'REFILL' | 'BONUS';
  amount: number;
  description: string;
  createdAt: string;
}

export interface StudioSettings {
  apiKey: string;
  apiBaseUrl: string;
  enableMockMode: boolean;
  defaultDuration: number;
  defaultAspectRatio: AspectRatio;
  defaultResolution: Resolution;
  defaultAudio: boolean;
  autoDownload: boolean;
  userEmail: string;
  userName: string;
}
