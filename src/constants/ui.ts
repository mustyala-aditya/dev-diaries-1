export const ANIMATION_DELAYS = {
  CARD_STAGGER: 0.1,
  SECTION_DELAY: 0.2,
  MODAL_DELAY: 0.1
} as const;

export const SCROLL_AMOUNTS = {
  CAROUSEL: 320, // Card width + gap
  SMOOTH_SCROLL_BEHAVIOR: 'smooth'
} as const;

export const BREAKPOINTS = {
  MOBILE: 'md',
  TABLET: 'lg',
  DESKTOP: 'xl'
} as const;

export const COLORS = [
  '#000000', '#374151', '#6B7280', '#EF4444', '#F97316', 
  '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'
] as const;

export const FONTS = [
  { name: 'Default', value: 'Inter, system-ui, sans-serif' },
  { name: 'Serif', value: 'Georgia, serif' },
  { name: 'Mono', value: 'JetBrains Mono, monospace' },
  { name: 'Cursive', value: 'Dancing Script, cursive' }
] as const;