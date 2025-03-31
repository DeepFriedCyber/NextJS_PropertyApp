'use client';

import { useEffect, useState } from 'react';
import { getXataClient } from '@/lib/xata';
import type { PropertiesRecord } from '@/lib/xata';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => (
  <section className="relative h-[80vh] bg-black">
    <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
    <div className="relative container mx-auto px-4 h-full flex items-center">
      <div className="max-w-2xl">
        <h1 className="text-6xl font-bold mb-6 text-white leading-tight">
          Modern Living
          <span className="block text-primary-500">Reimagined</span>
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Discover exceptional properties that blend luxury with contemporary design
        </p>
        <div className="flex gap-4">
          <Link 
            href="/properties"
            className="px-8 py-4 bg-primary-500 text-white rounded-none hover:bg-primary-600 transition-all font-semibold transform hover:-translate-y-1"
          >
            Browse Properties
          </Link>
          <Link 
            href="/contact"
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-none hover:bg-white hover:text-black transition-all font-semibold transform hover:-translate-y-1"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const PropertyCard = ({ property }: { property: PropertiesRecord }) => (
  <div className="group bg-white">
    <div className="relative overflow-hidden">
      <Image 
        src={property.imageUrl ?? '/placeholder-property.jpg'} 
        alt={property.title ?? 'Property'} 
        width={500} 
        height={300} 
        className="w-full h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
        <h2 className="text-xl font-semibold text-white mb-2">{property.title}</h2>
        <p className="text-gray-300">{property.location}</p>
      </div>
    </div>
    <div className="p-6 border-t border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold text-primary-500">
          £{property.price?.toLocaleString()}
        </p>
        <Link 
          href={`/property/${property.id}`}
          className="text-black hover:text-primary-500 transition-colors"
        >
          View Details →
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
        <div>
          <span className="block font-semibold">Bedrooms</span>
          {property.bedrooms}
        </div>
        <div>
          <span className="block font-semibold">Bathrooms</span>
          {property.bathrooms}
        </div>
        <div>
          <span className="block font-semibold">Area</span>
          {property.squareFeet} sq ft
        </div>
      </div>
    </div>
  </div>
);

const StatsSection = () => (
  <section className="bg-black py-20">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { number: "1000+", label: "Properties Sold" },
          { number: "500+", label: "Happy Clients" },
          { number: "50+", label: "Expert Agents" },
          { number: "10+", label: "Years Experience" }
        ].map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-4xl font-bold text-primary-500 mb-2">{stat.number}</div>
            <div className="text-white">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="bg-primary-500 py-20">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-6 text-white">Ready to Find Your Dream Home?</h2>
      <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
        Join thousands of satisfied customers who found their perfect property
      </p>
      <Link
        href="/auth/signup"
        className="inline-block px-8 py-4 bg-white text-primary-500 rounded-none hover:bg-black hover:text-white transition-all font-semibold transform hover:-translate-y-1"
      >
        Get Started Today
      </Link>
    </div>
  </section>
);

// Custom hook for fetching featured properties
const useFeaturedProperties = () => {
  const [featuredProperties, setFeaturedProperties] = useState<PropertiesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const xata = getXataClient();
        const properties = await xata.db.properties
          .sort('price', 'desc')
          .getMany({ pagination: { size: 3 } });
        
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

  // Add the console.log statement here
  console.log('📌 Properties in state:', featuredProperties);

  return { featuredProperties, loading, error };
};

// Main component
export default function HomePage() {
  const { featuredProperties, loading, error } = useFeaturedProperties();

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-none hover:bg-black transition-all"
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
      <HeroSection />
      
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Properties</h2>
          
          {featuredProperties.length === 0 && (
            <p className="text-center text-gray-500">No properties found.</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <StatsSection />
      <CTASection />
    </main>
  );
}



