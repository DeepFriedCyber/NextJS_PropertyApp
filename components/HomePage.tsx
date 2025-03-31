'use client';

import { useEffect, useState } from 'react';
import { getXataClient } from '@/lib/xata';
import type { PropertiesRecord } from '@/lib/xata';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => (
  <section className="relative h-[90vh] bg-black">
    <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
    <div className="relative container mx-auto px-4 h-full flex items-center">
      <div className="max-w-2xl">
        <h1 className="text-7xl font-bold mb-6 text-white leading-tight">
          Find Your
          <span className="block text-primary-500 mt-2">Dream Home</span>
        </h1>
        <p className="text-xl mb-8 text-gray-300 leading-relaxed">
          Discover exceptional properties that blend luxury with contemporary design. 
          Your dream home is just a click away.
        </p>
        <div className="flex gap-6">
          <Link 
            href="/properties"
            className="px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-semibold transform hover:-translate-y-1 duration-200 shadow-lg hover:shadow-primary-500/25"
          >
            Browse Properties
          </Link>
          <Link 
            href="/contact"
            className="px-8 py-4 border border-gold-500 text-gold-500 rounded-lg hover:bg-gold-500 hover:text-black transition-all font-semibold transform hover:-translate-y-1 duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const PropertyCard = ({ property }: { property: PropertiesRecord }) => (
  <div className="group bg-black rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
    <div className="relative overflow-hidden">
      <Image 
        src={property.imageUrl ?? '/placeholder-property.jpg'} 
        alt={property.title ?? 'Property'} 
        width={500} 
        height={300} 
        className="w-full h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-xl font-semibold text-white mb-2">{property.title}</h2>
          <p className="text-gray-200">{property.location}</p>
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold text-primary-500">
          £{property.price?.toLocaleString()}
        </p>
        <Link 
          href={`/property/${property.id}`}
          className="text-gold-500 hover:text-gold-400 transition-colors flex items-center gap-2 font-medium"
        >
          View Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span>{property.bedrooms} beds</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{property.bathrooms} baths</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{property.squareFeet} sq ft</span>
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
          <div key={index} className="text-center border border-primary-500/20 bg-black/50 p-8 rounded-lg">
            <div className="text-5xl font-bold text-primary-500 mb-2">{stat.number}</div>
            <div className="text-gold-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="relative py-24 overflow-hidden">
    <div className="absolute inset-0 bg-black opacity-90"></div>
    <div className="absolute inset-0 bg-[url('/luxury-home.jpg')] bg-cover bg-center"></div>
    <div className="relative container mx-auto px-4 text-center">
      <h2 className="text-5xl font-bold mb-6 text-white">Ready to Find Your Dream Home?</h2>
      <p className="text-xl mb-8 text-gold-400 max-w-2xl mx-auto">
        Join thousands of satisfied customers who found their perfect property. Let us help you start your journey home.
      </p>
      <Link
        href="/auth/signup"
        className="inline-block px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-semibold transform hover:-translate-y-1 duration-200 shadow-xl"
      >
        Get Started Today
      </Link>
    </div>
  </section>
);

export default function HomePage() {
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

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Properties</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-500"></div>
            </div>
          ) : featuredProperties.length === 0 ? (
            <p className="text-center text-gray-500">No properties found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      <StatsSection />
      <CTASection />
    </main>
  );

