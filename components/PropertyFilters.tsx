'use client';

import { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface PropertyFiltersProps {
  onFiltersChange: (filters: {
    radius: number;
    minPrice: number;
    maxPrice: number;
    propertyType: string;
    minBedrooms: number;
    maxBedrooms: number;
    propertyAge: string;
    minGardenSize: number;
    maxGardenSize: number;
    minParkingSpaces: number;
    maxParkingSpaces: number;
  }) => void;
}

const RADIUS_OPTIONS = [
  { value: 0.5, label: '0.5 miles' },
  { value: 1, label: '1 mile' },
  { value: 2, label: '2 miles' },
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' },
];

const PROPERTY_TYPES = [
  'All',
  'Terraced',
  'Semi-Detached',
  'Detached',
  'Apartment',
  'Bungalow',
  'Mews',
  'Townhouse',
];

const PROPERTY_AGES = [
  'All',
  'New Build',
  'Modern',
  'Period',
  'Victorian',
  'Edwardian',
];

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6];
const PARKING_OPTIONS = [0, 1, 2, 3, 4, 5];
const GARDEN_SIZE_OPTIONS = [
  { value: 0, label: 'No garden' },
  { value: 500, label: '500 sq ft' },
  { value: 1000, label: '1000 sq ft' },
  { value: 2000, label: '2000 sq ft' },
  { value: 5000, label: '5000 sq ft' },
  { value: 10000, label: '10000 sq ft' },
];

function PropertyFiltersContent({ onFiltersChange }: PropertyFiltersProps) {
  const [radius, setRadius] = useState(2);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [propertyType, setPropertyType] = useState('All');
  const [minBedrooms, setMinBedrooms] = useState(1);
  const [maxBedrooms, setMaxBedrooms] = useState(6);
  const [propertyAge, setPropertyAge] = useState('All');
  const [minGardenSize, setMinGardenSize] = useState(0);
  const [maxGardenSize, setMaxGardenSize] = useState(10000);
  const [minParkingSpaces, setMinParkingSpaces] = useState(0);
  const [maxParkingSpaces, setMaxParkingSpaces] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({
      radius: radius * 1609.34, // Convert miles to meters
      minPrice,
      maxPrice,
      propertyType,
      minBedrooms,
      maxBedrooms,
      propertyAge,
      minGardenSize,
      maxGardenSize,
      minParkingSpaces,
      maxParkingSpaces,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Radius
        </label>
        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
        >
          {RADIUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price Range (£)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            placeholder="Min"
            className="w-1/2 p-2 border rounded-md"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            placeholder="Max"
            className="w-1/2 p-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Property Type
        </label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bedrooms
        </label>
        <div className="flex gap-2">
          <select
            value={minBedrooms}
            onChange={(e) => setMinBedrooms(Number(e.target.value))}
            className="w-1/2 p-2 border rounded-md"
          >
            {BEDROOM_OPTIONS.map((num) => (
              <option key={`min-${num}`} value={num}>
                Min: {num}
              </option>
            ))}
          </select>
          <select
            value={maxBedrooms}
            onChange={(e) => setMaxBedrooms(Number(e.target.value))}
            className="w-1/2 p-2 border rounded-md"
          >
            {BEDROOM_OPTIONS.map((num) => (
              <option key={`max-${num}`} value={num}>
                Max: {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Property Age
        </label>
        <select
          value={propertyAge}
          onChange={(e) => setPropertyAge(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          {PROPERTY_AGES.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Garden Size
        </label>
        <div className="flex gap-2">
          <select
            value={minGardenSize}
            onChange={(e) => setMinGardenSize(Number(e.target.value))}
            className="w-1/2 p-2 border rounded-md"
          >
            {GARDEN_SIZE_OPTIONS.map((option) => (
              <option key={`min-${option.value}`} value={option.value}>
                Min: {option.label}
              </option>
            ))}
          </select>
          <select
            value={maxGardenSize}
            onChange={(e) => setMaxGardenSize(Number(e.target.value))}
            className="w-1/2 p-2 border rounded-md"
          >
            {GARDEN_SIZE_OPTIONS.map((option) => (
              <option key={`max-${option.value}`} value={option.value}>
                Max: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Parking Spaces
        </label>
        <div className="flex gap-2">
          <select
            value={minParkingSpaces}
            onChange={(e) => setMinParkingSpaces(Number(e.target.value))}
            className="w-1/2 p-2 border rounded-md"
          >
            {PARKING_OPTIONS.map((num) => (
              <option key={`min-${num}`} value={num}>
                Min: {num}
              </option>
            ))}
          </select>
          <select
            value={maxParkingSpaces}
            onChange={(e) => setMaxParkingSpaces(Number(e.target.value))}
            className="w-1/2 p-2 border rounded-md"
          >
            {PARKING_OPTIONS.map((num) => (
              <option key={`max-${num}`} value={num}>
                Max: {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
      >
        Apply Filters
      </button>
    </form>
  );
}

export default function PropertyFilters(props: PropertyFiltersProps) {
  return (
    <ErrorBoundary>
      <PropertyFiltersContent {...props} />
    </ErrorBoundary>
  );
} 