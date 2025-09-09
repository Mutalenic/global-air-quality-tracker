import { rest } from 'msw';

// Mock data for countries
const mockCountries = [
  {
    name: 'Zambia',
    region: 'Africa',
    latlng: [-15.0, 30.0],
    population: 18383955,
    cca2: 'ZM',
    flags: {
      png: 'https://flagcdn.com/w320/zm.png'
    }
  },
  {
    name: 'South Africa',
    region: 'Africa', 
    latlng: [-29.0, 24.0],
    population: 59308690,
    cca2: 'ZA',
    flags: {
      png: 'https://flagcdn.com/w320/za.png'
    }
  }
];

// Mock pollution data
const mockPollutionData = {
  coord: {
    lon: 28.2833,
    lat: -15.4167
  },
  list: [
    {
      dt: Date.now() / 1000,
      main: {
        aqi: 2
      },
      components: {
        co: 0.8,
        no: 0.1,
        no2: 8.2,
        o3: 95.3,
        so2: 2.1,
        pm2_5: 12.5,
        pm10: 20.3,
        nh3: 1.2
      }
    }
  ]
};

export const handlers = [
  // Mock countries endpoint
  rest.get('/api/countries', (req, res, ctx) => {
    const region = req.url.searchParams.get('region');
    const filteredCountries = mockCountries.filter(country => 
      !region || country.region === region
    );
    
    return res(
      ctx.status(200),
      ctx.json(filteredCountries)
    );
  }),

  // Mock pollution endpoint
  rest.get('/api/pollution', (req, res, ctx) => {
    const lat = req.url.searchParams.get('lat');
    const lon = req.url.searchParams.get('lon');
    
    return res(
      ctx.status(200),
      ctx.json({
        ...mockPollutionData,
        coord: {
          lat: parseFloat(lat || '-15.4167'),
          lon: parseFloat(lon || '28.2833')
        }
      })
    );
  }),

  // Mock RestCountries API
  rest.get('https://restcountries.com/v3.1/all', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockCountries)
    );
  }),

  // Mock OpenWeather API
  rest.get('https://api.openweathermap.org/data/2.5/air_pollution', (req, res, ctx) => {
    const lat = req.url.searchParams.get('lat');
    const lon = req.url.searchParams.get('lon');
    
    return res(
      ctx.status(200),
      ctx.json({
        ...mockPollutionData,
        coord: {
          lat: parseFloat(lat || '-15.4167'),
          lon: parseFloat(lon || '28.2833')
        }
      })
    );
  }),
];

export default handlers;