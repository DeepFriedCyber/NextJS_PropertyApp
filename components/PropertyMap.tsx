'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import ErrorBoundary from './ErrorBoundary';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  propertyAge?: string;
  gardenSize?: number;
  parkingSpaces?: number;
  latitude?: number;
  longitude?: number;
  epcRating?: string;
  councilTaxBand?: string;
  description?: string;
}

interface PropertyMapProps {
  center: {
    lat: number;
    lng: number;
    address: string;
  };
  zoom: number;
  properties: Property[];
}

function PropertyMapContent({ center, zoom, properties }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
      });

      try {
        const google = await loader.load();
        if (!mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: { lat: center.lat, lng: center.lng },
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        // Clear existing markers and info windows
        markersRef.current.forEach((marker) => marker.setMap(null));
        infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());
        markersRef.current = [];
        infoWindowsRef.current = [];

        // Add markers for each property
        properties.forEach((property) => {
          if (typeof property.latitude === 'number' && typeof property.longitude === 'number') {
            const marker = new google.maps.Marker({
              position: { lat: property.latitude, lng: property.longitude },
              map,
              title: property.title,
            });

            const content = `
              <div class="p-4 max-w-xs">
                <h3 class="text-lg font-semibold mb-2">${property.title}</h3>
                <p class="text-gray-600 mb-2">${property.location}</p>
                <p class="text-primary-500 font-semibold text-xl mb-3">
                  £${property.price.toLocaleString()}
                </p>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  ${property.propertyType ? `
                    <div>
                      <span class="text-gray-500">Type:</span>
                      <span class="ml-1">${property.propertyType}</span>
                    </div>
                  ` : ''}
                  ${property.bedrooms ? `
                    <div>
                      <span class="text-gray-500">Bedrooms:</span>
                      <span class="ml-1">${property.bedrooms}</span>
                    </div>
                  ` : ''}
                  ${property.bathrooms ? `
                    <div>
                      <span class="text-gray-500">Bathrooms:</span>
                      <span class="ml-1">${property.bathrooms}</span>
                    </div>
                  ` : ''}
                  ${property.propertyAge ? `
                    <div>
                      <span class="text-gray-500">Age:</span>
                      <span class="ml-1">${property.propertyAge}</span>
                    </div>
                  ` : ''}
                  ${property.gardenSize ? `
                    <div>
                      <span class="text-gray-500">Garden:</span>
                      <span class="ml-1">${property.gardenSize} sq ft</span>
                    </div>
                  ` : ''}
                  ${property.parkingSpaces ? `
                    <div>
                      <span class="text-gray-500">Parking:</span>
                      <span class="ml-1">${property.parkingSpaces} spaces</span>
                    </div>
                  ` : ''}
                </div>
              </div>
            `;

            const infoWindow = new google.maps.InfoWindow({
              content,
              maxWidth: 300,
            });

            marker.addListener('click', () => {
              infoWindowsRef.current.forEach((iw) => iw.close());
              infoWindow.open(map, marker);
            });

            markersRef.current.push(marker);
            infoWindowsRef.current.push(infoWindow);
          }
        });
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [center, zoom, properties]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[600px] rounded-lg shadow-lg"
    />
  );
}

export default function PropertyMap(props: PropertyMapProps) {
  return (
    <ErrorBoundary>
      <PropertyMapContent {...props} />
    </ErrorBoundary>
  );
}
