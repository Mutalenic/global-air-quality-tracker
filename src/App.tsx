import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './features/shared/config/i18n';

// Import existing components (will be converted to TypeScript gradually)
import Regions from './components/Home/Region';
import Countries from './components/Details/Countries';
import Pollutions from './components/Home/Pollution';

// Import new Zambia map component
import ZambiaMap from './features/maps/components/ZambiaMap';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Regions />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/pollution" element={<Pollutions />} />
            <Route path="/map" element={<ZambiaMapPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

// Simple page wrapper for the Zambia map
const ZambiaMapPage: React.FC = () => (
  <div className="zambia-map-page">
    <div className="container">
      <h1>Zambia Air Quality Map</h1>
      <ZambiaMap />
    </div>
  </div>
);

export default App;