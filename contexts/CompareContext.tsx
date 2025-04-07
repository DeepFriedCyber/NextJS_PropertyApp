'use client';

import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PropertiesRecord } from '@/lib/xata';

interface CompareContextType {
  compareList: string[];
  addToCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  showCompare: boolean;
  setShowCompare: (show: boolean) => void;
  compareProperties: PropertiesRecord[];
  setCompareProperties: (properties: PropertiesRecord[]) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [compareProperties, setCompareProperties] = useState<PropertiesRecord[]>([]);

  // Load compare list from localStorage on mount
  useEffect(() => {
    const savedList = localStorage.getItem('propertyCompareList');
    if (savedList) {
      try {
        const parsedList = JSON.parse(savedList);
        if (Array.isArray(parsedList)) {
          setCompareList(parsedList);
        }
      } catch (error) {
        console.error('Error parsing compare list from localStorage:', error);
      }
    }
  }, []);

  // Save compare list to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('propertyCompareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (id: string) => {
    if (compareList.length >= 4) {
      alert('You can compare up to 4 properties at a time.');
      return;
    }
    
    if (!compareList.includes(id)) {
      setCompareList(prev => [...prev, id]);
    }
  };

  const removeFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(item => item !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
    setShowCompare(false);
  };

  const isInCompare = (id: string) => {
    return compareList.includes(id);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        showCompare,
        setShowCompare,
        compareProperties,
        setCompareProperties,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}