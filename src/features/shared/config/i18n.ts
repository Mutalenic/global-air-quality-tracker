import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.regions': 'Regions',
      'nav.countries': 'Countries',
      'nav.pollution': 'Air Quality',
      'nav.maps': 'Maps',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.retry': 'Retry',
      'common.back': 'Back',
      'common.reload': 'Reload',
      
      // Air Quality
      'aqi.title': 'Air Quality',
      'aqi.good': 'Good',
      'aqi.moderate': 'Moderate',
      'aqi.unhealthy': 'Unhealthy for Sensitive Groups',
      'aqi.unhealthy_all': 'Unhealthy',
      'aqi.very_unhealthy': 'Very Unhealthy',
      'aqi.hazardous': 'Hazardous',
      
      // Regions & Countries
      'regions.title': 'Select Region',
      'countries.title': 'Countries',
      
      // Zambia specific
      'zambia.lusaka': 'Lusaka',
      'zambia.ndola': 'Ndola',
      'zambia.kitwe': 'Kitwe',
      'zambia.livingstone': 'Livingstone',
    },
  },
  bem: {
    translation: {
      // Navigation (Bemba)
      'nav.home': 'Ng\'anda',
      'nav.regions': 'Tufiko',
      'nav.countries': 'Fyalo',
      'nav.pollution': 'Umwela wa Mpepo',
      'nav.maps': 'Amapepe',
      
      // Common (Bemba)
      'common.loading': 'Tulelengela...',
      'common.error': 'Ifyalefya',
      'common.retry': 'Yesafye Nangu',
      'common.back': 'Bwelela',
      'common.reload': 'Yabuka Nangu',
      
      // Air Quality (Bemba)
      'aqi.title': 'Umwela wa Mpepo',
      'aqi.good': 'Bwino',
      'aqi.moderate': 'Pakati',
      'aqi.unhealthy': 'Taulwele',
      'aqi.unhealthy_all': 'Taulwele Pantu',
      'aqi.very_unhealthy': 'Taulwele Sana',
      'aqi.hazardous': 'Ububi',
      
      // Regions & Countries (Bemba)
      'regions.title': 'Salafye Icialo',
      'countries.title': 'Fyalo',
      
      // Zambia specific (Bemba)
      'zambia.lusaka': 'Lusaka',
      'zambia.ndola': 'Ndola',
      'zambia.kitwe': 'Kitwe',
      'zambia.livingstone': 'Livingstone',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false, // react already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;