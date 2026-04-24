// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DetectionProvider } from './context/DetectionContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DetectionPage from './pages/DetectionPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <ThemeProvider>
      <DetectionProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/detect" element={<DetectionPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </div>
        </Router>
      </DetectionProvider>
    </ThemeProvider>
  );
}

export default App;
