import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../types';
import { CardPreview } from '../Cards/CardPreview';
import { CarouselButton } from '../UI/CarouselButton';
import { useScrollButtons } from '../../hooks/useScrollButtons';
import { useCarousel } from '../../hooks/useCarousel';

interface CarouselSectionProps {
  title: string;
  emoji: string;
  cards: Card[];
  onToggleFavorite: (id: string) => void;
  onCardClick: (card: Card) => void;
}

export const CarouselSection: React.FC<CarouselSectionProps> = ({
  title,
  emoji,
  cards,
  onToggleFavorite,
  onCardClick
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight } = useScrollButtons(scrollRef);
  const { scrollCarousel } = useCarousel(scrollRef);

  if (cards.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white flex items-center">
          {emoji} {title}
        </h2>
      </div>
      
      {/* Netflix-style carousel container */}
      <div className="relative group">
        <CarouselButton
          direction="left"
          onClick={() => scrollCarousel('left')}
          visible={canScrollLeft}
        />
        
        <CarouselButton
          direction="right"
          onClick={() => scrollCarousel('right')}
          visible={canScrollRight}
        />
        
        {/* Carousel content */}
        <div 
          ref={scrollRef}
          className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex-shrink-0 w-80"
            >
              <CardPreview
                card={card}
                onToggleFavorite={onToggleFavorite}
                onClick={onCardClick}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};