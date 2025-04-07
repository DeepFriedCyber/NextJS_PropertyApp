'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import ErrorBoundary from './ErrorBoundary';

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

function LocationSearchContent({ onLocationSelect }: LocationSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: 'weekly',
          libraries: ['places'],
        });
        const google = await loader.load();
        autocompleteService.current = new google.maps.places.AutocompleteService();
        placesService.current = new google.maps.places.PlacesService(
          document.createElement('div')
        );
      } catch (err) {
        setError('Failed to load Google Maps');
        console.error(err);
      }
    };

    initGoogleMaps();
  }, []);

  const handleInputChange = async (value: string) => {
    setInputValue(value);
    if (!value.trim()) {
      setPredictions([]);
      return;
    }

    try {
      setIsLoading(true);
      const results = await autocompleteService.current?.getPlacePredictions({
        input: value,
        types: ['address'],
        componentRestrictions: { country: 'uk' },
      });
      setPredictions(results?.predictions || []);
    } catch (err) {
      setError('Failed to fetch predictions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictionSelect = async (placeId: string) => {
    try {
      setIsLoading(true);
      const place = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
        placesService.current?.getDetails(
          { placeId, fields: ['geometry', 'formatted_address'] },
          (result, status) => {
            if (status === 'OK' && result) {
              resolve(result);
            } else {
              reject(new Error('Failed to get place details'));
            }
          }
        );
      });

      if (place.geometry?.location) {
        onLocationSelect({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || '',
        });
        setInputValue(place.formatted_address || '');
        setPredictions([]);
      }
    } catch (err) {
      setError('Failed to get location details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    throw new Error(error);
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder="Enter a location..."
        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      {isLoading && (
        <div className="absolute right-2 top-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500" />
        </div>
      )}
      {predictions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              onClick={() => handlePredictionSelect(prediction.place_id)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LocationSearch(props: LocationSearchProps) {
  return (
    <ErrorBoundary>
      <LocationSearchContent {...props} />
    </ErrorBoundary>
  );
} 