import { useFavoritesStore } from '../store/useAppStore';

/**
 * Custom hook for managing favorite locations using Zustand
 * @returns {Object} Favorites state and management functions
 */
const useFavorites = () => {
  const {
    favorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isFavorite,
    favoritesCount,
  } = useFavoritesStore();

  const toggleFavorite = (location: any) => {
    const isFavorited = isFavorite(location.id);
    if (isFavorited) {
      removeFavorite(location.id);
    } else {
      addFavorite(location);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    hasFavorites: favorites.length > 0,
    favoritesCount,
  };
};

export default useFavorites;
