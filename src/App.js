import './App.css';
import React, {
  Suspense, lazy, useMemo, useState,
} from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LoadingSpinner from './components/utils/LoadingSpinner';
import HomePage from './components/Home/HomePage';
import Navbar from './components/Navbar/Navbar';

// Use React.lazy for code splitting
const Countries = lazy(() => import('./components/Details/Countries'));
const Pollutions = lazy(() => import('./components/Home/Pollution'));
const WeatherPage = lazy(() => import('./components/Weather/WeatherPage'));

function App() {
  const [mode, setMode] = useState('light');
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#4caf50' },
      secondary: { main: '#ff9800' },
      error: { main: '#f44336' },
      background: { default: mode === 'dark' ? '#181a1b' : '#f1f8e9', paper: mode === 'dark' ? '#23272a' : '#fff' },
    },
    typography: {
      fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
    },
    shape: { borderRadius: 12 },
  }), [mode]);

  // Pass setMode to Navbar if you want to control theme from Navbar

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <BrowserRouter>
          <Navbar mode={mode} setMode={setMode} />
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
    </ThemeProvider>
  );
}

export default App;
