# Global Air Quality Tracker

[![CI/CD Pipeline](https://github.com/Mutalenic/global-air-quality-tracker/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/Mutalenic/global-air-quality-tracker/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0.0-purple.svg)](https://vitejs.dev/)

A modern, responsive web application for tracking air quality across the globe. View real-time air pollution data, save your favorite locations, and monitor air quality indices for any region worldwide.

![App Screenshot](./src/images/countries.png)
![App Screenshot](./src/images/homepage.png)

## Live Demo

- **Production**: [Global Air Quality Tracker](https://global-air-quality-tracker.vercel.app/)
- **Video Presentation**: [Watch Demo](https://www.loom.com/share/b17aad1fdccf432692c0ad2576c8ffbd)

## Features

### Core Features

- **Real-time Air Quality Data**: Get current pollution levels from the OpenWeather Air Pollution API
- **Regional Exploration**: Browse countries by region (Africa, Asia, Europe, Americas, Oceania, Antarctic)
- **Detailed Metrics**: View comprehensive pollution data including PM2.5, PM10, O3, NO2, SO2, and CO
- **Favorites System**: Save your favorite locations for quick access
- **Health Recommendations**: Personalized advice based on current AQI levels

### User Experience

- **Toast Notifications**: Real-time feedback for all user actions
- **Loading Skeletons**: Smooth loading states for better perceived performance
- **Error Boundaries**: Graceful error handling with recovery options
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Dark Mode**: System-aware theme with manual toggle
- **Accessibility**: WCAG 2.1 Level AA compliant (skip links, ARIA labels, keyboard navigation)

### Performance

- **localStorage Caching**: 30-minute cache for reduced API calls
- **React.memo**: Optimized component re-renders
- **Image Lazy Loading**: Faster initial page loads
- **PWA Support**: Service worker for offline capability and installability

## Built With

### Core Technologies

- **React 18** - UI library
- **TypeScript** (strict mode) - Type safety
- **Zustand** - State management
- **React Router 6** - Client-side routing
- **Vite 6** - Build tool and dev server

### UI & Styling

- **Tailwind CSS 3** - Utility-first CSS framework
- **Framer Motion** - Animations
- **FontAwesome** - Icon library
- **Lucide React** - Icon library
- **React Toastify** - Toast notifications

### APIs

- **OpenWeather Air Pollution API** - Air pollution data
- **REST Countries API** - Country information
- **OpenWeather Weather API** - Weather data (optional)
- **AirVisual API** - Enhanced air quality data (optional)

### Development Tools

- **Jest 30** & **React Testing Library** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher)
- **npm** (v8.x or higher)
- **Git**
- A modern web browser (Chrome, Firefox, Safari, Edge)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mutalenic/global-air-quality-tracker.git
cd global-air-quality-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory (see `.env.example`):

```env
# OpenWeather API Configuration
# Get your API key from: https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here

# Mapbox API Configuration (optional)
# Get your API key from: https://mapbox.com/account/access-tokens
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here

# AirVisual API Configuration (optional - for enhanced air quality data)
# Get your API key from: https://www.airvisual.com/airvisual-api
VITE_AIRVISUAL_API_KEY=your_airvisual_api_key_here
```

**Get your OpenWeather API key:**
1. Visit [OpenWeather](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Copy the key to your `.env` file

### 4. Start Development Server

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run build        # Type-check and build for production
npm run preview      # Preview the production build
```

### Testing

```bash
npm test             # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:ci      # Run tests in CI mode
```

### Code Quality

```bash
npm run lint         # Check code for errors
npm run lint:fix     # Fix linting errors automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript compiler checks
```

## Project Structure

```
global-air-quality-tracker/
├── public/                 # Static files (favicon, manifest, service worker)
├── src/
│   ├── components/         # React components
│   │   ├── common/         # Shared components (AQIBadge, HealthRecommendations, etc.)
│   │   ├── Details/        # Country list, region details, pollution details
│   │   ├── ErrorBoundary/  # Error boundary wrapper
│   │   ├── Favorites/      # Favorites page
│   │   ├── Home/           # Home page (regions, country cards, pollution summary)
│   │   ├── layout/         # Layout primitives (Container, Flex, Grid)
│   │   ├── Navbar/         # Navigation bar
│   │   └── ui/             # UI primitives (Button, Card, LoadingSpinner)
│   ├── contexts/           # React contexts (ThemeContext)
│   ├── hooks/              # Custom React hooks (useFavorites, useServiceWorker)
│   ├── services/           # API services (weatherService, airVisualService)
│   ├── store/              # Zustand stores (useAppStore)
│   ├── types/              # TypeScript type declarations
│   ├── utils/              # Utility functions (cacheUtils, toastUtils, cn, performance)
│   ├── tests/              # Test files
│   └── images/             # Images and assets
├── .github/workflows/      # CI/CD pipelines
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Project dependencies and scripts
```

## Usage Guide

### 1. Browse Regions
- Click on any region card on the home page
- View all countries in that region

### 2. Search Countries
- Use the search bar to filter countries by name
- Click "See More" to load additional countries

### 3. View Air Quality
- Click the arrow icon on any country card
- View detailed pollution metrics
- Check the Air Quality Index (AQI) and health recommendations

### 4. Manage Favorites
- Click the heart icon to add/remove favorites
- Access all favorites from the navbar
- Click "View Air Quality" on any favorite to load its data

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [MIT.md](MIT.md) file for details.

## Author

**Nicholas Mutale**

- GitHub: [@Mutalenic](https://github.com/Mutalenic)
- LinkedIn: [Nicholas Mutale](https://linkedin.com/in/nicholas-mutale)

## Acknowledgments

- Air pollution data provided by [OpenWeather API](https://openweathermap.org/api/air-pollution)
- Country data from [REST Countries API](https://restcountries.com/)
- Icons from [FontAwesome](https://fontawesome.com/) and [Lucide](https://lucide.dev/)
- Linters configurations inspired by Microverse

## Show Your Support

Give a star if you like this project!

---

Made with care by [Nicholas Mutale](https://github.com/Mutalenic)
