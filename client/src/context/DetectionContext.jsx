// src/context/DetectionContext.jsx
import { createContext, useState, useContext } from 'react';

const DetectionContext = createContext();

export function DetectionProvider({ children }) {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('detectionHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentResult, setCurrentResult] = useState(null);

  const addToHistory = (result) => {
    const newHistory = [result, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('detectionHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('detectionHistory');
  };

  const downloadResult = (result) => {
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fakeout-result-${result.timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DetectionContext.Provider value={{
      history,
      currentResult,
      setCurrentResult,
      addToHistory,
      clearHistory,
      downloadResult,
    }}>
      {children}
    </DetectionContext.Provider>
  );
}

export function useDetection() {
  return useContext(DetectionContext);
}
