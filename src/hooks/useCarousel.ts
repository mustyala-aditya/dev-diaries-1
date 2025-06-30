import { RefObject } from 'react';
import { SCROLL_AMOUNTS } from '../constants/ui';

export const useCarousel = (scrollRef: RefObject<HTMLDivElement>) => {
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const currentScroll = scrollRef.current.scrollLeft;
    const newScroll = direction === 'left' 
      ? Math.max(0, currentScroll - SCROLL_AMOUNTS.CAROUSEL)
      : currentScroll + SCROLL_AMOUNTS.CAROUSEL;
    
    scrollRef.current.scrollTo({
      left: newScroll,
      behavior: SCROLL_AMOUNTS.SMOOTH_SCROLL_BEHAVIOR as ScrollBehavior
    });
  };

  return { scrollCarousel };
};