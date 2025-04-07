'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getXataClient } from '@/lib/xata';
import type { PropertiesRecord } from '@/lib/xata';
import PropertyCard from './PropertyCard';

const HeroSection = () => {
  const [searchType, setSearchType] = useState('buy');

  return (
    <section className="relative h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-5"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative container mx-auto px-6 h-full flex items-center"
      >
        <div className="max-w-3xl">
          <h1 className="text-8xl font-bold mb-8 text-white leading-none">
            Discover
            <span className="block text-primary-400 mt-4">Your Perfect Home</span>
          </h1>
          <p className="text-2xl mb-12 text-gray-300 leading-relaxed max-w-2xl">
            Explore curated luxury properties designed for modern living.
          </p>

          {/* Property Search Box - Inspired by Hously */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-xl mb-12 border border-white/20 shadow-2xl"
          >
            <div className="flex mb-6 border-b border-gray-700">
              <button
                onClick={() => setSearchType('buy')}
                className={`px-6 py-3 font-medium text-lg ${searchType === 'buy' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-gray-300'}`}
              >
                For Sale
              </button>
              <button
                onClick={() => setSearchType('rent')}
                className={`px-6 py-3 font-medium text-lg ${searchType === 'rent' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-gray-300'}`}
              >
                To Let
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Location</label>
                <select className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-primary-400 focus:ring-primary-400">
                  <option>Any Location</option>
                  <option>London</option>
                  <option>Manchester</option>
                  <option>Birmingham</option>
                  <option>Edinburgh</option>
                  <option>Glasgow</option>
                  <option>Liverpool</option>
                  <option>Bristol</option>
                  <option>Leeds</option>
                  <option>Sheffield</option>
                  <option>Cardiff</option>
                  <option>Belfast</option>
                  <option>Newcastle</option>
                  <option>Oxford</option>
                  <option>Cambridge</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Property Type</label>
                <select className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-primary-400 focus:ring-primary-400">
                  <option>Any Type</option>
                  <option>Detached</option>
                  <option>Semi-Detached</option>
                  <option>Terraced</option>
                  <option>Flat</option>
                  <option>Bungalow</option>
                  <option>Cottage</option>
                  <option>New Build</option>
                  <option>Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 text-sm">Price Range</label>
                <select className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-primary-400 focus:ring-primary-400">
                  <option>Any Price</option>
                  <option>Up to £200k</option>
                  <option>£200k - £350k</option>
                  <option>£350k - £500k</option>
                  <option>£500k - £750k</option>
                  <option>£750k - £1M</option>
                  <option>£1M - £2M</option>
                  <option>£2M+</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                // Redirect to properties search page with the selected filters
                window.location.href = '/properties/search';
              }}
              className="w-full mt-6 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Search Properties
            </button>
          </motion.div>

          <div className="flex flex-wrap gap-6">
            <Link
              href="/properties"
              className="group px-10 py-5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all font-medium flex items-center gap-3"
            >
              Explore Properties
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
            <Link
              href="/contact"
              className="px-10 py-5 border-2 border-gold-400 text-gold-400 rounded-full hover:bg-gold-400 hover:text-black transition-all font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
};



const StatsSection = () => {
  const stats = [
    {
      number: "1000+",
      label: "Properties Sold",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
      )
    },
    {
      number: "500+",
      label: "Happy Clients",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      )
    },
    {
      number: "50+",
      label: "Expert Agents",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      )
    },
    {
      number: "10+",
      label: "Years Experience",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-32 bg-[url('/stats-bg.jpg')] bg-cover bg-fixed bg-center relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-[1px] w-12 bg-primary-400"></div>
              <span className="text-primary-400 font-medium">Our Achievements</span>
              <div className="h-[1px] w-12 bg-primary-400"></div>
            </div>
          </div>

          <h2 className="text-5xl font-bold mb-6">Our Numbers Speak</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We take pride in our achievements and the trust our clients place in us
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={index}
              className="text-center p-8 rounded-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-primary-400/50 transition-all duration-300"
            >
              <div className="relative mb-6 mx-auto">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary-400 to-gold-400 opacity-30 blur-lg"></div>
                <div className="relative w-20 h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center text-primary-400">
                  {stat.icon}
                </div>
              </div>

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                className="text-6xl font-bold text-white mb-3"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-gold-400">
                  {stat.number}
                </span>
              </motion.div>

              <div className="text-gold-400 font-medium text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="relative py-32 overflow-hidden">
    {/* Background with overlay */}
    <div className="absolute inset-0 bg-black opacity-80"></div>
    <div className="absolute inset-0 bg-[url('/luxury-home.jpg')] bg-cover bg-center bg-fixed"></div>

    {/* Decorative elements */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-30"></div>
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-30"></div>

    {/* Floating shapes */}
    <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl"></div>
    <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-gold-400/10 blur-3xl"></div>

    <div className="relative container mx-auto px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gray-900/60 backdrop-blur-lg p-12 md:p-16 rounded-3xl border border-gray-800 shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-12 bg-primary-400"></div>
                <span className="text-primary-400 font-medium">Get Started Today</span>
                <div className="h-[1px] w-12 bg-primary-400"></div>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
              Ready to Begin Your <span className="text-gold-400">Journey?</span>
            </h2>

            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our expert team of property consultants is ready to guide you through every step of your property journey, from initial search to final acquisition.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/auth/signup"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all font-medium text-lg"
              >
                Start Your Journey
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>

              <Link
                href="/contact"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent border-2 border-gold-400 text-gold-400 rounded-full hover:bg-gold-400 hover:text-black transition-all font-medium text-lg"
              >
                Contact an Agent
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
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
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center p-8 bg-gray-900 rounded-2xl max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p className="text-xl text-red-400 mb-6">Unable to load properties</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      
      <section className="py-32 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            {/* Hously-inspired section heading */}
            <div className="inline-block">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-[1px] w-12 bg-primary-400"></div>
                <span className="text-primary-400 font-medium">Properties</span>
                <div className="h-[1px] w-12 bg-primary-400"></div>
              </div>
            </div>

            <h2 className="text-5xl font-bold mb-6">Featured Properties</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore our handpicked selection of premium properties
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No properties available at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {featuredProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {/* View All Properties Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-16"
              >
                <Link
                  href="/properties"
                  className="group px-10 py-4 bg-transparent border-2 border-primary-500 text-primary-500 rounded-full hover:bg-primary-500 hover:text-white transition-all font-medium flex items-center gap-3"
                >
                  View All Properties
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* How It Works Section - Inspired by Hously */}
      <section className="py-32 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-block">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-[1px] w-12 bg-primary-400"></div>
                <span className="text-primary-400 font-medium">Process</span>
                <div className="h-[1px] w-12 bg-primary-400"></div>
              </div>
            </div>

            <h2 className="text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We've simplified the process of finding and purchasing your dream home
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: (
                  <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                ),
                title: "Search & Discover",
                description: "Browse our extensive collection of premium properties and find the perfect match for your lifestyle and preferences."
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                ),
                title: "Tour Properties",
                description: "Schedule viewings of your favorite properties with our expert agents who will guide you through every detail."
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                ),
                title: "Close the Deal",
                description: "Our team of professionals will assist you through the entire purchasing process, ensuring a smooth and stress-free experience."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 text-center hover:border-primary-400/50 transition-all duration-300"
              >
                <div className="relative mb-8 mx-auto">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary-400 to-gold-400 opacity-30 blur-lg"></div>
                  <div className="relative w-20 h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  );
}

