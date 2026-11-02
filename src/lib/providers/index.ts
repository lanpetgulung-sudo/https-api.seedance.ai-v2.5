import { IVideoProvider, StudioSettings } from '../../types/index';
import { SeedanceProvider } from './seedance.provider';
import { MockSeedanceProvider } from './mock.provider';

export function getVideoProvider(settings?: Partial<StudioSettings>): { provider: IVideoProvider; isMock: boolean } {
  // If explicitly mock or no API key, use Mock provider
  const useMock = settings?.enableMockMode !== false || !settings?.apiKey;
  
  if (useMock) {
    return {
      provider: new MockSeedanceProvider(),
      isMock: true,
    };
  }

  return {
    provider: new SeedanceProvider(settings?.apiKey, settings?.apiBaseUrl),
    isMock: false,
  };
}

export * from './types';
export * from './seedance.provider';
export * from './mock.provider';
