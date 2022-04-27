import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';
import Home from './components/Home/Home';
import { getCountries } from './redux/Country/countries';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCountries());
  }, []);

  return (
    <div className="spaceApp">
      <Navbar />
      <Home />
      <Routes>
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
