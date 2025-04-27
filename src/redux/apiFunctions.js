export const fetchCountries = async (reg, page = 1, limit = 10) => {
  // Construct pagination parameters for the API
  const paginationParams = `&page=${page}&limit=${limit}`;

  try {
    // Fetch only the countries from a specific region with pagination
    const response = await fetch(`https://restcountries.com/v3.1/region/${reg}?fields=name,region,latlng,population,cca2,flags${paginationParams}`);

    // Check if the API supports pagination or not
    // If not, we'll manually implement pagination on the client-side
    const data = await response.json();

    if (Array.isArray(data)) {
      // If the API doesn't support pagination, we'll manually paginate the results
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return data.slice(startIndex, endIndex);
    }

    return data;
  } catch (error) {
    // Fallback to fetching all countries and filtering manually
    const allCountries = await fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => data.filter((country) => country.region === reg));

    // Manually implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return allCountries.slice(startIndex, endIndex);
  }
};

// Fetch all countries for autocomplete
export const fetchAllCountries = async () => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,region');
    if (!response.ok) {
      throw new Error(`RestCountries API error: ${response.status}`);
    }
    const data = await response.json();
    // Format for react-select and filter out entries missing essential data
    return data
      .filter((country) => country.name?.common && country.cca2) // Ensure common name and cca2 exist
      .map((country) => ({
        value: country.cca2, // Use country code as value
        label: country.name.common, // Use common name as label
        region: country.region || 'Other', // Assign a default region if missing
      }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching all countries:', error);
    return []; // Return empty array on error
  }
};

const url = 'https://api.openweathermap.org/data/2.5/air_pollution?';
const id = '6574f405463f1e3a64b32c567ddd4bc8';

export const getPollutionInfor = async (lat, lon) => {
  // Add caching to prevent duplicate API calls
  const cacheKey = `pollution-${lat}-${lon}`;
  const cachedData = sessionStorage.getItem(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const res = await fetch(`${url}lat=${lat}&lon=${lon}&appid=${id}`);
  const data = await res.json();

  // Cache the result
  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};
