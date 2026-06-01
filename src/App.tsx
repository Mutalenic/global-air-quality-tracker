import './App.css';
import './components/common/Accessibility.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Regions from './components/Home/Region';
import Countries from './components/Details/Countries';
import Pollutions from './components/Home/Pollution';
import Favorites from './components/Favorites/Favorites';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const App: React.FC = () => {
  return (
    <div className="app">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <ErrorBoundary>
        <BrowserRouter>
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Regions />} />
              <Route path="/countries" element={<Countries />} />
              <Route path="/pollution" element={<Pollutions />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
        </BrowserRouter>
      </ErrorBoundary>
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
        theme="light"
      />
    </div>
  );
}

export default App;
