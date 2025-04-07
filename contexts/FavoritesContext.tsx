'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface FavoritesContextType {
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  favorites: string[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const isFavorite = useCallback((id: string) => {
    return favorites.includes(id);
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }
      
      return newFavorites;
    });
  }, []);

  return (
    <FavoritesContext.Provider value={{ isFavorite, toggleFavorite, favorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 