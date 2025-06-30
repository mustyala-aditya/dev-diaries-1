import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  visible: boolean;
}

export const CarouselButton: React.FC<CarouselButtonProps> = ({
  direction,
  onClick,
  visible
}) => {
  if (!visible) return null;

  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
  const positionClass = direction === 'left' ? 'left-4' : 'right-4';

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`absolute ${positionClass} top-1/2 -translate-y-1/2 z-10 p-3 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100`}
    >
      <Icon className="h-6 w-6" />
    </motion.button>
  );
};