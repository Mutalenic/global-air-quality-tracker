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
    // Log the raw count from the API
    // eslint-disable-next-line no-console
    console.log(`[fetchAllCountries] Raw count from API: ${data.length}`);

    // Format for react-select, filter out only if cca2 is missing
    return data
      .filter((country) => country.cca2) // Only filter if cca2 (used for value) is missing
      .map((country) => ({
        value: country.cca2, // Use country code as value
        label: country.name?.common || country.cca2, // Use common name or fallback to cca2 for label
        region: country.region || 'Other', // Assign a default region if missing
      }));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching all countries:', error);
    return []; // Return empty array on error
  }
};

// Search country by name
export const searchCountryByNameAPI = async (name) => {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fields=name,region,latlng,population,cca2,flags`);
    if (!response.ok) {
      // If 404, it means not found, return empty array, otherwise throw error
      if (response.status === 404) {
        return [];
      }
      throw new Error(`RestCountries API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error searching country by name "${name}":`, error);
    return []; // Return empty array on error
  }
};

const url = 'https://api.openweathermap.org/data/2.5/air_pollution?';
const id = '2e201239377589c1ce89446fd84f5b6d'; // Updated API key from user

export const getPollutionInfor = async (lat, lon) => {
  const cacheKey = `pollution-${lat}-${lon}`;
  const cachedData = sessionStorage.getItem(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Fetch pollution data directly, let errors bubble up
  const res = await fetch(`${url}lat=${lat}&lon=${lon}&appid=${id}`);
  if (!res.ok) {
    throw new Error(`API responded with status: ${res.status}`);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Invalid JSON response from pollution API');
  }
  // Validate that the response contains the expected data structure
  if (!data || !data.list || !data.list[0] || !data.list[0].components) {
    throw new Error('Invalid data format received from pollution API');
  }

  sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
};
