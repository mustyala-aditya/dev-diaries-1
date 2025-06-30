import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from '../UI/SearchBar';
import { TagFilter } from '../UI/TagFilter';
import { NavigationTabs } from '../UI/NavigationTabs';
import { useResponsiveTags } from '../../hooks/useResponsiveTags';

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  tags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
  activeView: string;
  onViewChange: (view: string) => void;
  showSearchResults: boolean;
}

const NAVIGATION_TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'all', label: 'All Cards' },
  { key: 'favorites', label: 'Favorites' },
  { key: 'recent', label: 'Recent' }
];

export const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  tags,
  selectedTags,
  onTagClick,
  activeView,
  onViewChange,
  showSearchResults
}) => {
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const visibleTagsCount = useResponsiveTags(tagsContainerRef, tags.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative px-8 pt-8"
    >
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 via-slate-700/30 to-slate-800/30 backdrop-blur-xl rounded-3xl mx-8"></div>
      
      <div className="relative space-y-6 p-6">
        {/* Centered Search Bar */}
        <div className="flex justify-center">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClearSearch}
            showClearButton={searchQuery.length > 0 || selectedTags.length > 0}
          />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex justify-center">
            <div ref={tagsContainerRef} className="w-full max-w-6xl">
              <TagFilter
                tags={tags}
                selectedTags={selectedTags}
                onTagClick={onTagClick}
                visibleCount={visibleTagsCount}
              />
            </div>
          </div>
        )}

        {/* Navigation Bar - Only show when not searching */}
        {!showSearchResults && (
          <div className="flex justify-center pt-2">
            <NavigationTabs
              tabs={NAVIGATION_TABS}
              activeTab={activeView}
              onTabChange={onViewChange}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};