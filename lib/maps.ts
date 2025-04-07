import { Loader } from '@googlemaps/js-api-loader';
// @ts-ignore
import type { google } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  version: 'weekly',
  libraries: ['places', 'geocoding'],
});

export async function getGoogleMapsInstance() {
  return await loader.load();
}

export async function geocodeAddress(address: string) {
  const google = await getGoogleMapsInstance();
  const geocoder = new google.maps.Geocoder();
  
  try {
    const response = await geocoder.geocode({ address });
    if (response.results.length > 0) {
      const result = response.results[0];
      if (!result?.geometry?.location || !result.formatted_address) {
        throw new Error('Invalid geocoding result');
      }
      return {
        lat: result.geometry.location.lat(),
        lng: result.geometry.location.lng(),
        formattedAddress: result.formatted_address,
      };
    }
    throw new Error('No results found');
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
}

export async function getNearbyProperties(lat: number, lng: number, radius: number = 5000) {
  const google = await getGoogleMapsInstance();
  const service = new google.maps.places.PlacesService(
    document.createElement('div')
  );

  return new Promise<google.maps.places.PlaceResult[]>((resolve, reject) => {
    service.nearbySearch(
      {
        location: { lat, lng },
        radius,
        type: 'real_estate_agency',
      },
      (
        results: google.maps.places.PlaceResult[] | null,
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error(`Places service failed with status: ${status}`));
        }
      }
    );
  });
} 