import { Card } from '../types';
import { normalizeDate } from './dateUtils';

export const normalizeCardDates = (card: Card): Card => ({
  ...card,
  createdAt: normalizeDate(card.createdAt),
  updatedAt: normalizeDate(card.updatedAt)
});

export const normalizeCardsDates = (cards: Card[]): Card[] => 
  cards.map(normalizeCardDates);

export const getContentPreview = (content: string, maxLength: number = 120): string => {
  // Strip HTML tags and get plain text preview
  const textContent = content.replace(/<[^>]*>/g, '');
  return textContent.substring(0, maxLength) + (textContent.length > maxLength ? '...' : '');
};

export const filterCardsBySearch = (cards: Card[], query: string): Card[] => {
  if (!query.trim()) return cards;
  
  const searchTerm = query.toLowerCase().trim();
  return cards.filter(card => {
    const titleMatch = card.title.toLowerCase().includes(searchTerm);
    const contentMatch = card.content.toLowerCase().includes(searchTerm);
    const tagMatch = card.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    const explanationMatch = card.explanation.toLowerCase().includes(searchTerm);
    
    return titleMatch || contentMatch || tagMatch || explanationMatch;
  });
};

export const filterCardsByTags = (cards: Card[], selectedTags: string[]): Card[] => {
  if (selectedTags.length === 0) return cards;
  
  return cards.filter(card =>
    selectedTags.every(tag => card.tags.includes(tag))
  );
};

export const groupCardsByDate = (cards: Card[]): [string, Card[]][] => {
  const groups: { [key: string]: Card[] } = {};
  
  cards.forEach(card => {
    const dateKey = card.updatedAt.toISOString().split('T')[0]; // YYYY-MM-DD format
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(card);
  });

  // Sort groups by date (newest first)
  return Object.entries(groups).sort(([a], [b]) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
};