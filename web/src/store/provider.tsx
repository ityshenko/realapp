'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuthStore, useFilterStore, useFavoritesStore } from './index';

interface StoreProviderProps {
  children: ReactNode;
}

const StoreContext = createContext<null>(null);

export function StoreProvider({ children }: StoreProviderProps) {
  // Stores are already initialized via Zustand
  // This provider is just for context if needed in the future
  return (
    <StoreContext.Provider value={null}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === null) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return {
    auth: useAuthStore,
    filter: useFilterStore,
    favorites: useFavoritesStore,
  };
};
