import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPollution } from '../redux/apiFunctions';

/**
 * Custom hook to fetch and manage pollution data
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {boolean} shouldFetch - Whether to fetch data
 * @returns {Object} Pollution state with data, loading, and error
 */
const usePollution = (lat, lon, shouldFetch = true) => {
  const dispatch = useDispatch();
  const { data: pollution, loading, error } = useSelector((state) => state.pollution);

  useEffect(() => {
    if (shouldFetch && lat !== undefined && lon !== undefined) {
      fetchPollution(lat, lon, dispatch);
    }
  }, [lat, lon, shouldFetch, dispatch]);

  return {
    pollution,
    loading,
    error,
    hasPollution: pollution && pollution.length > 0,
  };
};

export default usePollution;
