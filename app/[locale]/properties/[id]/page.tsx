'use client';

import { useEffect, useState } from 'react';
import { PropertiesRecord } from '@/lib/xata';
import { useParams } from 'next/navigation';
import PropertyImage from '@/components/PropertyImage';

export default function PropertyDetails() {
  const [property, setProperty] = useState<PropertiesRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property details');
        }
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Property not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <PropertyImage
            src={property.image_url}
            alt={property.title}
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Price:</span> £{property.price?.toLocaleString()}</p>
                <p><span className="font-medium">Location:</span> {property.location}</p>
                <p><span className="font-medium">Bedrooms:</span> {property.bedrooms}</p>
                <p><span className="font-medium">Bathrooms:</span> {property.bathrooms}</p>
                <p><span className="font-medium">Status:</span> {property.status}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600">{property.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 