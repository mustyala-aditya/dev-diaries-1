import React from 'react';
import { motion } from 'framer-motion';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
  visibleCount: number;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onTagClick,
  visibleCount
}) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex items-center justify-center space-x-3 overflow-hidden">
      {tags.slice(0, visibleCount).map(tag => (
        <motion.button
          key={tag}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTagClick(tag)}
          className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 whitespace-nowrap ${
            selectedTags.includes(tag)
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20 hover:border-white/40'
          }`}
        >
          #{tag}
        </motion.button>
      ))}

      {tags.length > visibleCount && (
        <span className="flex-shrink-0 px-3 py-2 bg-white/5 text-slate-400 text-sm rounded-full border border-white/10">
          +{tags.length - visibleCount} more
        </span>
      )}
    </div>
  );
};