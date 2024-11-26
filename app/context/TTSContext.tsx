// app/context/TTSContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TTSContextType {
  activeTTSId: string | null;
  setActiveTTSId: (id: string | null) => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTTSId, setActiveTTSId] = useState<string | null>(null);

  return (
    <TTSContext.Provider value={{ activeTTSId, setActiveTTSId }}>
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = (): TTSContextType => {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
};
