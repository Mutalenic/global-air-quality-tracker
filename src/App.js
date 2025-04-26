import './App.css';
import React, { Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

// Use React.lazy for code splitting
const Regions = lazy(() => import('./components/Home/Region'));
const Countries = lazy(() => import('./components/Details/Countries'));
const Pollutions = lazy(() => import('./components/Home/Pollution'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  }}
  >
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Regions />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/pollution" element={<Pollutions />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
