// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import HeritageAudio from './pages/HeritageAudio'; // This matches your file name
import TripPlanner from './pages/TripPlanner';
import LocalGuides from './pages/LocalGuides';
import SOS from './pages/SOS';
import Permits from './pages/Permits';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/heritage-audio" element={<HeritageAudio />} />
            <Route path="/trip-planner" element={<TripPlanner />} />
            <Route path="/guides" element={<LocalGuides />} />
            <Route path="/sos" element={<SOS />} />
            <Route path="/permits" element={<Permits />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;