import { useEffect, useState, RefObject } from 'react';

export const useResponsiveTags = (
  tagsContainerRef: RefObject<HTMLDivElement>,
  totalTags: number
) => {
  const [visibleTagsCount, setVisibleTagsCount] = useState(9);

  useEffect(() => {
    const calculateVisibleTags = () => {
      if (!tagsContainerRef.current || totalTags === 0) return;

      const container = tagsContainerRef.current;
      const containerWidth = container.offsetWidth;
      
      // Approximate tag width (including margin) - adjust based on styling
      const avgTagWidth = 120;
      const maxTags = Math.floor(containerWidth / avgTagWidth);
      
      // Ensure we show at least 6 tags and at most all available tags
      const calculatedCount = Math.max(6, Math.min(maxTags, totalTags));
      setVisibleTagsCount(calculatedCount);
    };

    calculateVisibleTags();
    window.addEventListener('resize', calculateVisibleTags);
    
    return () => window.removeEventListener('resize', calculateVisibleTags);
  }, [totalTags, tagsContainerRef]);

  return visibleTagsCount;
};