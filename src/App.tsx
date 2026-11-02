/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MockModeBanner } from './components/shared/MockModeBanner';
import { GenerationProgressModal } from './components/shared/GenerationProgressModal';

import { DashboardView } from './components/pages/DashboardView';
import { TextToVideoView } from './components/pages/TextToVideoView';
import { ImageToVideoView } from './components/pages/ImageToVideoView';
import { ReferenceToVideoView } from './components/pages/ReferenceToVideoView';
import { VideoToVideoView } from './components/pages/VideoToVideoView';
import { CharacterStudioView } from './components/pages/CharacterStudioView';
import { HistoryView } from './components/pages/HistoryView';
import { SettingsView } from './components/pages/SettingsView';

function StudioMain() {
  const { activeTab } = useStudio();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'text-to-video':
        return <TextToVideoView />;
      case 'image-to-video':
        return <ImageToVideoView />;
      case 'reference-to-video':
        return <ReferenceToVideoView />;
      case 'video-to-video':
        return <VideoToVideoView />;
      case 'characters':
        return <CharacterStudioView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans">
      <MockModeBanner />

      <div className="flex-1 flex min-h-0">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#09090b]">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto">{renderActiveView()}</main>
        </div>
      </div>

      <GenerationProgressModal />
    </div>
  );
}

export default function App() {
  return (
    <StudioProvider>
      <StudioMain />
    </StudioProvider>
  );
}
