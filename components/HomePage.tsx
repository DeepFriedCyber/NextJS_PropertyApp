'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebaseClient';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';

interface FeaturedProperty {
  id: string;
  name: string;
  price: number;
  location: string;
  imageUrl: string;
}

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const propertiesRef = collection(db, 'properties');
        const q = query(
          propertiesRef,
          orderBy('price', 'desc'),
          limit(3)
        );
        
        const querySnapshot = await getDocs(q);
        const properties = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FeaturedProperty[];
        
        setFeaturedProperties(properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 font-heading">
            Find Your Dream Property
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the perfect home that matches your lifestyle
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/properties"
              className="px-8 py-3 bg-white text-primary-500 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
            >
              Browse Properties
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-3 bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-primary-500 transition-all font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">Featured Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map(property => (
              <div key={property.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative">
                  <Image 
                    src={property.imageUrl} 
                    alt={property.name} 
                    width={500} 
                    height={300} 
                    className="object-cover w-full h-[200px]"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{property.name}</h2>
                  <p className="text-gray-600 mb-2">{property.location}</p>
                  <p className="text-lg font-bold text-blue-600 mb-4">
                    ${property.price.toLocaleString()}
                  </p>
                  <Link 
                    href={`/property/${property.id}`}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-3 bg-white text-primary-500 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </main>
  );
}