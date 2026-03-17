import React, { useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface SemanticSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export const SemanticSearchBar: React.FC<SemanticSearchBarProps> = ({
  query,
  onQueryChange,
  onClear,
  isLoading,
  placeholder = "What do you feel like learning today?",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Clear on Escape when focused
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onClear();
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search happens automatically via debounce, no need to submit
    inputRef.current?.blur();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 transition-all"
          aria-label="Search for audio content"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Keyboard hint - hidden on mobile */}
      <div className="hidden sm:block absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        {!query && (
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-400 bg-gray-100 rounded border border-gray-200">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        )}
      </div>
    </form>
  );
};
