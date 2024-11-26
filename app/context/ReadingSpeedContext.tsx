// app/context/ReadingSpeedContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ReadingSpeedContextType {
  readingSpeed: number;
  setReadingSpeed: (speed: number) => void;
}

const ReadingSpeedContext = createContext<ReadingSpeedContextType | undefined>(undefined);

export const ReadingSpeedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [readingSpeed, setReadingSpeed] = useState(1); // Default rate

  // Load from localStorage on mount
  useEffect(() => {
    const savedSpeed = localStorage.getItem('readingSpeed');
    if (savedSpeed) {
      setReadingSpeed(parseFloat(savedSpeed));
    }
  }, []);

  // Save to localStorage whenever readingSpeed changes
  useEffect(() => {
    localStorage.setItem('readingSpeed', readingSpeed.toString());
  }, [readingSpeed]);

  return (
    <ReadingSpeedContext.Provider value={{ readingSpeed, setReadingSpeed }}>
      {children}
    </ReadingSpeedContext.Provider>
  );
};

export const useReadingSpeed = (): ReadingSpeedContextType => {
  const context = useContext(ReadingSpeedContext);
  if (!context) {
    throw new Error('useReadingSpeed must be used within a ReadingSpeedProvider');
  }
  return context;
};
