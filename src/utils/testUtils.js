import React from 'react';
import PropTypes from 'prop-types';
import { render as rtlRender, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import pollutionReducer from '../redux/Reducers/Pollution';
import countriesReducer from '../redux/Reducers/Countries';
import { ThemeProvider } from '../context/ThemeContext';

// Create test store
const rootReducer = combineReducers({
  countriesReducer,
  pollutionReducer,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

/**
 * Test wrapper that includes all necessary providers
 * @param {Object} props
 * @param {React.ReactNode} props.children - Components to wrap
 * @param {boolean} props.withRouter - Whether to include Router (default: true)
 * @param {boolean} props.withTheme - Whether to include ThemeProvider (default: true)
 * @param {boolean} props.withStore - Whether to include Redux Provider (default: true)
 */
export const TestWrapper = ({
  children,
  withRouter = true,
  withTheme = true,
  withStore = true,
}) => {
  let wrapped = children;

  if (withStore) {
    wrapped = <Provider store={store}>{wrapped}</Provider>;
  }

  if (withTheme) {
    wrapped = <ThemeProvider>{wrapped}</ThemeProvider>;
  }

  if (withRouter) {
    wrapped = <BrowserRouter>{wrapped}</BrowserRouter>;
  }

  return wrapped;
};

/**
 * Render component with all necessary providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Options for the wrapper
 */
export const renderWithProviders = (ui, options = {}) => {
  const { withRouter = true, withTheme = true, withStore = true, ...rest } = options;

  const Wrapper = ({ children }) => (
    <TestWrapper withRouter={withRouter} withTheme={withTheme} withStore={withStore}>
      {children}
    </TestWrapper>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return rtlRender(ui, {
    wrapper: Wrapper,
    ...rest,
  });
};

// Re-export render for convenience
export { rtlRender as render, screen, fireEvent, waitFor, cleanup };
