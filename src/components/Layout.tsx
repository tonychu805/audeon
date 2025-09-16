import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { AudioPlayer } from './AudioPlayer';

export const Layout: React.FC = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    // Use setTimeout to ensure DOM is updated first
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  // Extract active tab from current pathname
  const getActiveTab = (pathname: string): string => {
    const path = pathname.split('/')[1];
    if (['home', 'explore', 'library'].includes(path)) {
      return path;
    }
    // For creator and track pages, determine parent tab
    if (pathname.startsWith('/creators') || pathname.startsWith('/tracks')) {
      // Default to home for now, could be more sophisticated
      return 'home';
    }
    return 'home';
  };

  const activeTab = getActiveTab(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-4 pt-6 pb-[calc(env(safe-area-inset-bottom,0px)+14rem)]">
        <Outlet />
      </main>

      <AudioPlayer />
      <Navigation activeTab={activeTab} />
    </div>
  );
};
