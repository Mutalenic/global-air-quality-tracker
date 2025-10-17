# 🌍 Global Air Quality Tracker![](https://img.shields.io/badge/Microverse-blueviolet)



[![CI/CD Pipeline](https://github.com/Mutalenic/global-air-quality-tracker/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/Mutalenic/global-air-quality-tracker/actions)# React capstone project - Global-Air-Quality-Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)In this React capstone project, I built a mobile web application to check a list of metrics (numeric values) that I created making use of React and Redux.

[![Redux](https://img.shields.io/badge/Redux-4.2.0-purple.svg)](https://redux.js.org/)

I selected an API that provides numeric data about Air Pollution across the globe and then built the web app around it.

A modern, responsive web application for tracking air quality across the globe. View real-time air pollution data, save your favorite locations, and monitor air quality indices for any region worldwide.![screenshoot](./src/images/countries.png) ![screenshoot2](./src/images/homepage.png)



![App Screenshot](./src/images/homepage.png)## Built With

- React (A free and open-source front-end JavaScript library for building user interfaces based on UI components)

## ✨ Features- Stylelint (A mighty, modern linter that helps you avoid errors and enforce conventions in your styles).

- ESlint (A mighty, modern linter that helps you avoid errors and enforce conventions in JavaScript codes)

### 🌐 Core Features- Redux

- **Real-time Air Quality Data**: Get current pollution levels from the OpenWeather API- GitFlow.

- **Regional Exploration**: Browse countries by region (Africa, Asia, Europe, Americas, Oceania)- NPM.

- **Detailed Metrics**: View comprehensive pollution data including PM2.5, PM10, O3, NO2, SO2, and CO

- **Favorites System**: Save your favorite locations for quick access## Live Demo

- **Interactive Maps**: Visual representation of regions and countries

[Global Air Tracker](https://global-air-quality-tracker.vercel.app/) to the deployed web application.

### 🎨 User Experience

- **Toast Notifications**: Real-time feedback for all user actions## Video 

- **Loading Skeletons**: Smooth loading states for better perceived performance[Video Presentation](https://www.loom.com/share/b17aad1fdccf432692c0ad2576c8ffbd)

- **Error Boundaries**: Graceful error handling with recovery options

- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

- **Accessibility**: WCAG 2.1 Level AA compliant### Prerequisites

The basic requirements for building the executable are:

### ⚡ Performance

- **localStorage Caching**: 30-minute cache for reduced API calls- A working browser application (Google Chrome, Mozilla Firefox, Microsoft Edge...)

- **Code Splitting**: Optimized bundle size with React lazy loading- VSCode or any other equivalent code editor

- **React.memo**: Optimized component re-renders- Node Package Manager (For installing packages like Lighthouse, webhint & stylelint used for checking for debugging bad codes before deployment)

- **Image Lazy Loading**: Faster initial page loads

## Getting Started

## 🚀 Live Demo

Follow these simple example steps.

- **Production**: [Global Air Quality Tracker](https://global-air-quality-tracker.vercel.app/)

- **Video Presentation**: [Watch Demo](https://www.loom.com/share/b17aad1fdccf432692c0ad2576c8ffbd)### Prerequisites



## 🛠️ Built WithYou need node js and npm installed on your machine. If so, continue with the next steps.



### Core Technologies### Setup

- **React 18.0.0** - Modern UI library

- **Redux 4.2.0** - State managementInstall dependencies by running:

- **React Router 6.3.0** - Client-side routing

- **Redux Thunk** - Async action handling`npm install`



### UI & Styling### Usage

- **CSS3** - Custom styling with modern features

- **FontAwesome** - Icon libraryRun the live server by the following command:

- **React Toastify** - Toast notifications

`npm start`

### APIs

- **OpenWeather API** - Air pollution data### Run tests

- **REST Countries API** - Country information

`npm test`

### Development Tools

- **Jest & React Testing Library** - Testing framework### Deployment

- **ESLint** - Code linting

- **Prettier** - Code formattingTo deploy this project run the following command:

- **GitHub Actions** - CI/CD pipeline

`npm run build`

## 📋 Prerequisites

and copy the content of the `build` directory to the root folder of your production environment.

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher)## Authors

- **npm** (v8.x or higher)

- **Git**👤 **Nicholas Mutale**

- Modern web browser (Chrome, Firefox, Safari, Edge)

- GitHub: [@Mutalenic](https://github.com/Mutalenic)

## 🔧 Installation & Setup- Twitter: [@nicomutale](https://twitter.com/nicomutale)

- LinkedIn: [@nicomutale](https://linkedin.com/in/nicomutale)

### 1. Clone the Repository



```bash## 🤝 Contributing

git clone https://github.com/Mutalenic/global-air-quality-tracker.git

cd global-air-quality-trackerContributions, issues, and feature requests are welcome!

```



### 2. Install Dependencies## Show your support



```bashGive a ⭐️ if you like this project!

npm install

```## Acknowledgments



### 3. Environment Configuration- Linters configurations are made by Microverse

- Design is inspired by [Nelson Sakwa](https://www.behance.net/sakwadesignstudio)

Create a `.env` file in the root directory:

## LICENSE

```envThis project is MIT licensed.

REACT_APP_API_KEY=your_openweather_api_key_here
```

**Get your API key:**
1. Visit [OpenWeather](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Copy the key to your `.env` file

### 4. Start Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

### Development
```bash
npm start              # Start development server
npm test               # Run tests in watch mode
npm test:coverage      # Run tests with coverage report
npm run build          # Build for production
```

### Code Quality
```bash
npm run lint           # Check code for errors
npm run lint:fix       # Fix linting errors automatically
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
```

### Analysis
```bash
npm run analyze        # Analyze bundle size
```

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test:coverage

# Run tests in CI mode
npm test:ci
```

**Test Statistics:**
- ✅ 26 tests passing
- ✅ 6 test suites
- ✅ 100% action creator coverage
- ✅ 100% reducer coverage

## 📁 Project Structure

```
global-air-quality-tracker/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── redux/            # Redux store
│   ├── utils/            # Utility functions
│   ├── tests/            # Test files
│   └── images/           # Images and assets
├── .github/workflows/    # CI/CD pipelines
└── README.md
```

## 🎯 Usage Guide

### 1. Browse Regions
- Click on any region card on the home page
- View all countries in that region

### 2. Search Countries
- Use the search bar to filter countries by name
- Click "See More" to load additional countries

### 3. View Air Quality
- Click the arrow icon on any country card
- View detailed pollution metrics
- Check the Air Quality Index (AQI)

### 4. Manage Favorites
- Click the heart icon to add/remove favorites
- Access all favorites from the navbar

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [MIT.md](MIT.md) file for details.

## 👨‍💻 Author

**Nicholas Mutale**

- GitHub: [@Mutalenic](https://github.com/Mutalenic)
- LinkedIn: [Nicholas Mutale](https://linkedin.com/in/nicholas-mutale)

## 🙏 Acknowledgments

- Air pollution data provided by [OpenWeather API](https://openweathermap.org/api/air-pollution)
- Country data from [REST Countries API](https://restcountries.com/)
- Icons from [FontAwesome](https://fontawesome.com/)

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

Made with ❤️ by [Nicholas Mutale](https://github.com/Mutalenic)
