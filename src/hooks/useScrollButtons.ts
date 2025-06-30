import { useEffect, useState, RefObject } from 'react';

interface UseScrollButtonsReturn {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  updateScrollButtons: () => void;
}

export const useScrollButtons = (
  scrollRef: RefObject<HTMLDivElement>
): UseScrollButtonsReturn => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener('scroll', updateScrollButtons);
    
    // Initial check
    updateScrollButtons();

    return () => {
      element.removeEventListener('scroll', updateScrollButtons);
    };
  }, [scrollRef]);

  // Update when content changes
  useEffect(() => {
    const timer = setTimeout(updateScrollButtons, 100);
    return () => clearTimeout(timer);
  }, []);

  return { canScrollLeft, canScrollRight, updateScrollButtons };
};