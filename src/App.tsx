import './App.css';
import './components/common/Accessibility.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { PageTransition } from './components/common/PageTransition';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import Regions from './components/Home/Region';
import Countries from './components/Details/Countries';
import Pollutions from './components/Home/Pollution';
import Favorites from './components/Favorites/Favorites';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const routerFutureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="app min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <OfflineIndicator />
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <BrowserRouter future={routerFutureConfig}>
          <ErrorBoundary>
            <PageTransition>
              <main id="main-content" className="min-h-screen">
                <Routes>
                  <Route path="/" element={<Regions />} />
                  <Route path="/countries" element={<Countries />} />
                  <Route path="/pollution" element={<Pollutions />} />
                  <Route path="/favorites" element={<Favorites />} />
                </Routes>
              </main>
            </PageTransition>
          </ErrorBoundary>
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
