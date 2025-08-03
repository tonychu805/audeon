import React, { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { Navigation } from './components/Navigation';
import { AudioPlayer } from './components/AudioPlayer';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { LibraryPage } from './pages/LibraryPage';
import { CreatorProfilePage } from './pages/CreatorProfilePage';
import { TrackDetailPage } from './pages/TrackDetailPage';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  const handleCreatorClick = (creatorId: string) => {
    setSelectedCreator(creatorId);
  };

  const handleTrackClick = (trackId: string) => {
    setSelectedTrack(trackId);
  };
  const handleBackToExplore = () => {
    setSelectedCreator(null);
  };

  const handleBackFromTrack = () => {
    setSelectedTrack(null);
  };

  const handleNavigationChange = (tab: string) => {
    // Clear any selected creator or track when navigating
    setSelectedCreator(null);
    setSelectedTrack(null);
    setActiveTab(tab);
  };

  const renderContent = () => {
    if (selectedTrack) {
      return (
        <TrackDetailPage 
          trackId={selectedTrack} 
          onBack={handleBackFromTrack}
        />
      );
    }
    
    if (selectedCreator) {
      return (
        <CreatorProfilePage 
          creatorId={selectedCreator} 
          onBack={handleBackToExplore}
          onTrackClick={handleTrackClick}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomePage onCreatorClick={handleCreatorClick} onTrackClick={handleTrackClick} />;
      case 'explore':
        return <ExplorePage onCreatorClick={handleCreatorClick} />;
      case 'library':
        return <LibraryPage onTrackClick={handleTrackClick} />;
      default:
        return <HomePage onCreatorClick={handleCreatorClick} onTrackClick={handleTrackClick} />;
    }
  };

  return (
    <PlayerProvider>
      <div className="min-h-screen bg-gray-50">
        <main className="pb-32 px-4 pt-6">
          {renderContent()}
        </main>
        
        <AudioPlayer />
        <Navigation activeTab={activeTab} onTabChange={handleNavigationChange} />
      </div>
    </PlayerProvider>
  );
}

export default App;