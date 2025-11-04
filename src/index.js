import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/theme.css';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/configureStore';
import { ThemeProvider } from './context/ThemeContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>,
);
