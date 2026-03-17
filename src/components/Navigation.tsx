import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Library } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
}

const NAV_HEIGHT_REM = 3.75; // 60px similar to Spotify bottom dock

export const Navigation: React.FC<NavigationProps> = ({ activeTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'explore', label: 'Explore', icon: Search, path: '/explore' },
    { id: 'library', label: 'Library', icon: Library, path: '/library' }
  ];

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-gray-200 backdrop-blur-md shadow-[0_-8px_24px_rgba(15,23,42,0.08)] z-40"
      style={{
        height: `calc(${NAV_HEIGHT_REM}rem + env(safe-area-inset-bottom, 0px))`,
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)',
        paddingTop: '0.75rem',
      }}
    >
      <div className="mx-auto flex max-w-[480px] justify-around items-center h-full">
        {tabs.map(({ id, label, icon: Icon, path }) => (
          <Link
            key={id}
            to={path}
            state={id === 'explore' ? null : undefined}
            aria-current={activeTab === id ? 'page' : undefined}
            className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-colors duration-200 ${
              activeTab === id 
                ? 'text-purple-600 bg-purple-50 shadow-[0_6px_16px_rgba(139,92,246,0.18)]' 
                : 'text-gray-500 hover:text-purple-600'
            }`}
          >
            <Icon className="w-6 h-6 mb-1" aria-hidden="true" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
