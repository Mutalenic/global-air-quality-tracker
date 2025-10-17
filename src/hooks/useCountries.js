import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../redux/apiFunctions';

/**
 * Custom hook to fetch and manage countries data
 * @param {string} region - The region to fetch countries for
 * @returns {Object} Countries state with data, loading, and error
 */
const useCountries = (region) => {
  const dispatch = useDispatch();
  const { countries, loading, error } = useSelector((state) => state.countries);

  useEffect(() => {
    if (region) {
      fetchCountries(region, dispatch);
    }
  }, [region, dispatch]);

  return {
    countries,
    loading,
    error,
    hasCountries: countries && countries.length > 0,
  };
};

export default useCountries;
