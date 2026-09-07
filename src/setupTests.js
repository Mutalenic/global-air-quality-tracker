// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toBeInTheDocument())
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Provide Vite env vars for tests (babel-plugin-transform-vite-meta-env
// rewrites import.meta.env.VITE_X → process.env.VITE_X)
process.env.VITE_OPENWEATHER_API_KEY = 'test-api-key';
process.env.VITE_MAPBOX_ACCESS_TOKEN = 'test-mapbox-token';
process.env.VITE_AIRVISUAL_API_KEY = 'test-airvisual-key';
process.env.VITE_RESTCOUNTRIES_API_KEY = 'test-restcountries-key';

// jsdom does not implement matchMedia — polyfill it for components that
// check system color-scheme preference (ThemeProvider).
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});
