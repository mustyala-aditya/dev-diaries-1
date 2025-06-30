import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCardStore } from '../../store/cardStore';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../../types';
import { 
  normalizeCardsDates, 
  filterCardsBySearch, 
  filterCardsByTags, 
  groupCardsByDate 
} from '../../utils/cardUtils';
import { formatDateHeader } from '../../utils/dateUtils';
import { WelcomeSection } from './WelcomeSection';
import { SearchSection } from './SearchSection';
import { CarouselSection } from './CarouselSection';
import { CardPreview } from '../Cards/CardPreview';
import { EmptyState } from '../UI/EmptyState';
import { ANIMATION_DELAYS } from '../../constants/ui';

interface DashboardProps {
  searchQuery?: string;
}

type ViewType = 'dashboard' | 'all' | 'favorites' | 'recent';

export const Dashboard: React.FC<DashboardProps> = ({ searchQuery = '' }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    cards,
    toggleFavorite,
    getRecentCards,
    getFavoriteCards,
    getAllTags,
    searchQuery: globalSearchQuery,
    searchCards
  } = useCardStore();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  // Get user-specific cards with normalized dates
  const userCards = useMemo(() => {
    if (!user) return [];
    return normalizeCardsDates(
      cards.filter(card => card.userId === user.id)
    );
  }, [cards, user]);

  // Get cards with normalized dates for other functions
  const recentCards = useMemo(() => 
    normalizeCardsDates(getRecentCards()), 
    [getRecentCards]
  );

  const favoriteCards = useMemo(() => 
    normalizeCardsDates(getFavoriteCards()), 
    [getFavoriteCards]
  );

  const allTags = getAllTags();

  // Update search in store when local search changes
  useEffect(() => {
    searchCards(localSearchQuery);
  }, [localSearchQuery, searchCards]);

  // Filter cards based on search query and selected tags
  const filteredCards = useMemo(() => {
    const currentQuery = searchQuery || localSearchQuery || globalSearchQuery;
    
    let filtered = filterCardsBySearch(userCards, currentQuery);
    filtered = filterCardsByTags(filtered, selectedTags);
    
    return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [userCards, searchQuery, localSearchQuery, globalSearchQuery, selectedTags]);

  const groupedCards = useMemo(() => 
    groupCardsByDate(filteredCards), 
    [filteredCards]
  );

  const handleNewCard = () => navigate('/editor');
  const handleCardClick = (card: Card) => navigate(`/editor/${card.id}`);

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearSearch = () => {
    setLocalSearchQuery('');
    setSelectedTags([]);
    searchCards('');
  };

  const getDisplayCards = (): Card[] => {
    const currentQuery = searchQuery || localSearchQuery || globalSearchQuery;
    
    const filterCards = (cards: Card[]) => {
      if (!currentQuery.trim() && selectedTags.length === 0) return cards;
      
      let filtered = filterCardsBySearch(cards, currentQuery);
      return filterCardsByTags(filtered, selectedTags);
    };

    switch (activeView) {
      case 'favorites':
        return filterCards(favoriteCards);
      case 'recent':
        return filterCards(recentCards);
      case 'all':
        return filteredCards;
      default:
        return [];
    }
  };

  // Show welcome section only if no cards exist at all
  const showWelcome = userCards.length === 0;

  // Check if we have search results to show
  const currentQuery = searchQuery || localSearchQuery || globalSearchQuery;
  const hasSearchQuery = currentQuery && currentQuery.trim();
  const hasFilters = selectedTags.length > 0;
  const showSearchResults = hasSearchQuery || hasFilters;

  // Get remaining cards (excluding favorites and recent) for dashboard view
  const remainingCards = useMemo(() => {
    if (activeView !== 'dashboard') return [];
    
    const favoriteIds = new Set(favoriteCards.map(card => card.id));
    const recentIds = new Set(recentCards.map(card => card.id));
    
    return filteredCards.filter(card => 
      !favoriteIds.has(card.id) && !recentIds.has(card.id)
    );
  }, [filteredCards, favoriteCards, recentCards, activeView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="space-y-8 pb-12">
        {/* Welcome Section - Only show when no cards exist */}
        {showWelcome && (
          <WelcomeSection onCreateCard={handleNewCard} />
        )}

        {/* Search and Filter Section - Only show when cards exist */}
        {!showWelcome && (
          <SearchSection
            searchQuery={localSearchQuery}
            onSearchChange={setLocalSearchQuery}
            onClearSearch={clearSearch}
            tags={allTags}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
            activeView={activeView}
            onViewChange={(view) => setActiveView(view as ViewType)}
            showSearchResults={showSearchResults}
          />
        )}

        {/* Search Results View - Show when searching */}
        {!showWelcome && showSearchResults && (
          <div className="px-8">
            <AnimatePresence mode="wait">
              {filteredCards.length > 0 ? (
                <motion.div
                  key="search-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold text-white px-4">
                    🔍 Search Results
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCards.map((card, index) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * ANIMATION_DELAYS.CARD_STAGGER }}
                      >
                        <CardPreview
                          card={card}
                          onToggleFavorite={toggleFavorite}
                          onClick={handleCardClick}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <EmptyState
                  key="search-empty"
                  icon={Search}
                  title="No cards found"
                  description="Try adjusting your search or filter criteria"
                  onAction={handleNewCard}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Dashboard View - Only show when not searching */}
        {!showWelcome && !showSearchResults && activeView === 'dashboard' && (
          <div className="space-y-12 px-8">
            {/* Recently Updated Section */}
            <CarouselSection
              title="Recently Updated"
              emoji="🕒"
              cards={recentCards}
              onToggleFavorite={toggleFavorite}
              onCardClick={handleCardClick}
            />

            {/* Favorites Section */}
            <CarouselSection
              title="Favorites"
              emoji="⭐"
              cards={favoriteCards}
              onToggleFavorite={toggleFavorite}
              onCardClick={handleCardClick}
            />

            {/* Remaining Cards */}
            {remainingCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white px-4">📚 More Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
                  {remainingCards.slice(0, 8).map((card) => (
                    <div key={card.id}>
                      <CardPreview
                        card={card}
                        onToggleFavorite={toggleFavorite}
                        onClick={handleCardClick}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* All Cards View with Date Grouping - Only show when not searching */}
        {!showWelcome && !showSearchResults && activeView === 'all' && (
          <div className="px-8">
            <AnimatePresence mode="wait">
              {groupedCards.length > 0 ? (
                <motion.div
                  key="all-cards-grouped"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-12"
                >
                  {groupedCards.map(([dateKey, cardsForDate], groupIndex) => (
                    <motion.div
                      key={dateKey}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: groupIndex * ANIMATION_DELAYS.CARD_STAGGER }}
                      className="space-y-6"
                    >
                      {/* Date Header */}
                      <div className="flex items-baseline space-x-4">
                        <h3 className="text-2xl font-bold text-white">
                          {formatDateHeader(dateKey)}
                        </h3>
                        <span className="text-sm text-slate-400">
                          {cardsForDate.length} {cardsForDate.length === 1 ? 'card' : 'cards'}
                        </span>
                      </div>
                      
                      {/* Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {cardsForDate.map((card) => (
                          <div key={card.id}>
                            <CardPreview
                              card={card}
                              onToggleFavorite={toggleFavorite}
                              onClick={handleCardClick}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <EmptyState
                  key="all-cards-empty"
                  icon={Search}
                  title="No cards found"
                  description="Try adjusting your search or filter criteria"
                  onAction={handleNewCard}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Favorites and Recent Views - Only show when not searching */}
        {!showWelcome && !showSearchResults && (activeView === 'favorites' || activeView === 'recent') && (
          <div className="px-8">
            <AnimatePresence mode="wait">
              {getDisplayCards().length > 0 ? (
                <motion.div
                  key={`${activeView}-grid`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {getDisplayCards().map((card) => (
                      <div key={card.id}>
                        <CardPreview
                          card={card}
                          onToggleFavorite={toggleFavorite}
                          onClick={handleCardClick}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <EmptyState
                  key={`${activeView}-empty`}
                  icon={Search}
                  title={
                    activeView === 'favorites' ? 'No favorite cards' : 'No recent cards'
                  }
                  description={
                    (localSearchQuery || selectedTags.length > 0) 
                      ? 'Try adjusting your search or filter criteria'
                      : activeView === 'favorites' 
                        ? 'Mark some cards as favorites to see them here'
                        : 'Create your first card to get started'
                  }
                  onAction={handleNewCard}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};