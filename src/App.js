import './App.css';
import React, { Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoadingSpinner from './components/utils/LoadingSpinner';
import HomePage from './components/Home/HomePage';

// Use React.lazy for code splitting
const Regions = lazy(() => import('./components/Home/Region'));
const Countries = lazy(() => import('./components/Details/Countries'));
const Pollutions = lazy(() => import('./components/Home/Pollution'));
const WeatherPage = lazy(() => import('./components/Weather/WeatherPage'));

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/pollution" element={<Pollutions />} />
            <Route path="/weather" element={<WeatherPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
