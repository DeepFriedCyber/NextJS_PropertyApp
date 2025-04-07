import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CompareProvider, useCompare } from '@/contexts/CompareContext';
import { PropertiesRecord } from '@/lib/xata';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock child component to test the context
const TestComponent = () => {
  const { 
    compareList, 
    addToCompare, 
    removeFromCompare, 
    clearCompare, 
    isInCompare,
    showCompare,
    setShowCompare,
    compareProperties,
    setCompareProperties
  } = useCompare();

  return (
    <div>
      <div data-testid="compare-list">{JSON.stringify(compareList)}</div>
      <div data-testid="show-compare">{showCompare.toString()}</div>
      <div data-testid="compare-properties">{JSON.stringify(compareProperties)}</div>
      <button onClick={() => addToCompare('1')}>Add Property 1</button>
      <button onClick={() => addToCompare('2')}>Add Property 2</button>
      <button onClick={() => removeFromCompare('1')}>Remove Property 1</button>
      <button onClick={() => clearCompare()}>Clear Compare</button>
      <button onClick={() => setShowCompare(true)}>Show Compare</button>
    </div>
  );
};

describe('CompareContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should add properties to compare list', () => {
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    );

    // Add first property
    fireEvent.click(screen.getByText('Add Property 1'));
    expect(screen.getByTestId('compare-list').textContent).toContain('1');

    // Add second property
    fireEvent.click(screen.getByText('Add Property 2'));
    expect(screen.getByTestId('compare-list').textContent).toContain('2');
  });

  it('should remove properties from compare list', () => {
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    );

    // Add and then remove property
    fireEvent.click(screen.getByText('Add Property 1'));
    fireEvent.click(screen.getByText('Remove Property 1'));
    expect(screen.getByTestId('compare-list').textContent).not.toContain('1');
  });

  it('should clear compare list', () => {
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    );

    // Add properties and then clear
    fireEvent.click(screen.getByText('Add Property 1'));
    fireEvent.click(screen.getByText('Add Property 2'));
    fireEvent.click(screen.getByText('Clear Compare'));
    expect(screen.getByTestId('compare-list').textContent).toBe('[]');
  });

  it('should handle show compare state', () => {
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    );

    // Toggle show compare
    fireEvent.click(screen.getByText('Show Compare'));
    expect(screen.getByTestId('show-compare').textContent).toBe('true');
  });

  it('should persist compare list in localStorage', async () => {
    render(
      <CompareProvider>
        <TestComponent />
      </CompareProvider>
    );

    // Add property and check localStorage
    await act(async () => {
      fireEvent.click(screen.getByText('Add Property 1'));
    });
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('propertyCompareList', JSON.stringify(['1']));
  });
}); 