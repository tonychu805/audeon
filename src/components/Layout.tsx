import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { AudioPlayer } from './AudioPlayer';

export const Layout: React.FC = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll to top and focus main content on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (mainRef.current) {
        mainRef.current.focus();
      }
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 focus:bg-white focus:text-gray-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="px-4 pt-6 pb-[calc(env(safe-area-inset-bottom,0px)+12rem)]"
      >
        <Outlet />
      </main>

      <AudioPlayer />
      <Navigation activeTab={activeTab} />
    </div>
  );
};
