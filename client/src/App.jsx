import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DetectionProvider } from './context/DetectionContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DetectionPage from './pages/DetectionPage';
import HistoryPage from './pages/HistoryPage';
import VisualizePage from './pages/VisualizePage';
import FeaturesPage from './pages/FeaturesPage';
import TechnologyPage from './pages/TechnologyPage';

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
              <Route path="/visualize" element={<VisualizePage />} />
              <Route path="/features" element={<FeaturesPage />} />
<Route path="/technology" element={<TechnologyPage />} />
            </Routes>
          </div>
        </Router>
      </DetectionProvider>
    </ThemeProvider>
  );
}

export default App;