export const config = {
  api: {
    openWeatherApiKey: process.env.REACT_APP_OPENWEATHER_API_KEY || '',
    openAQApiKey: process.env.REACT_APP_OPENAQ_API_KEY || '',
    zmdApiUrl: process.env.REACT_APP_ZMD_API_URL || '',
    zemaApiUrl: process.env.REACT_APP_ZEMA_API_URL || '',
  },
  map: {
    defaultCenter: {
      lat: Number(process.env.REACT_APP_DEFAULT_CENTER_LAT) || -15.4167,
      lng: Number(process.env.REACT_APP_DEFAULT_CENTER_LNG) || 28.2833,
    },
    mapboxToken: process.env.REACT_APP_MAPBOX_TOKEN || '',
  },
  features: {
    enablePWA: process.env.REACT_APP_ENABLE_PWA === 'true',
    enableOffline: process.env.REACT_APP_ENABLE_OFFLINE === 'true',
    enableUSSD: process.env.REACT_APP_ENABLE_USSD === 'true',
  },
};