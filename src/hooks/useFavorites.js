import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Custom hook for managing favorite locations
 * @returns {Object} Favorites state and management functions
 */
const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage('favorites', []);

  // Add a location to favorites
  const addFavorite = useCallback(
    (location) => {
      setFavorites((prev) => {
        // Check if already favorited
        const exists = prev.some((fav) => fav.id === location.id);
        if (exists) return prev;
        return [...prev, { ...location, favoritedAt: Date.now() }];
      });
    },
    [setFavorites],
  );

  // Remove a location from favorites
  const removeFavorite = useCallback(
    (locationId) => {
      setFavorites((prev) => prev.filter((fav) => fav.id !== locationId));
    },
    [setFavorites],
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (location) => {
      const isFavorited = favorites.some((fav) => fav.id === location.id);
      if (isFavorited) {
        removeFavorite(location.id);
      } else {
        addFavorite(location);
      }
    },
    [favorites, addFavorite, removeFavorite],
  );

  // Check if a location is favorited
  const isFavorite = useCallback(
    (locationId) => {
      return favorites.some((fav) => fav.id === locationId);
    },
    [favorites],
  );

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    hasFavorites: favorites.length > 0,
    favoritesCount: favorites.length,
  };
};

export default useFavorites;
