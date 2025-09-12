import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Library } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'explore', label: 'Explore', icon: Search, path: '/explore' },
    { id: 'library', label: 'Library', icon: Library, path: '/library' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
      <div className="flex justify-around">
        {tabs.map(({ id, label, icon: Icon, path }) => (
          <Link
            key={id}
            to={path}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === id 
                ? 'text-purple-600 bg-purple-50' 
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};