'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('buy');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Always use semantic search mode
    const params = new URLSearchParams();
    params.append('mode', 'semantic');

    // Add search term if provided
    if (searchTerm.trim()) {
      params.append('q', searchTerm);
    }

    // Add filters
    if (location) params.append('location', location);
    if (propertyType) params.append('propertyType', propertyType);
    if (priceRange) params.append('priceRange', priceRange);
    if (searchType === 'rent') params.append('listingType', 'rent');
    if (searchType === 'buy') params.append('listingType', 'sale');

    router.push(`/properties/search?${params.toString()}`);
  };

  return (
    <section className="relative pt-24 pb-28 bg-gradient-to-b from-dark-600 to-dark-500 text-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="450" height="556" viewBox="0 0 450 556" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="277" cy="63" r="225" fill="url(#paint0_linear_25:217)"></circle>
            <circle cx="17.9997" cy="182" r="18" fill="url(#paint1_radial_25:217)"></circle>
            <circle cx="76.9997" cy="288" r="34" fill="url(#paint2_radial_25:217)"></circle>
            <circle cx="325.486" cy="302.87" r="180" transform="rotate(-37.6852 325.486 302.87)" fill="url(#paint3_linear_25:217)"></circle>
            <circle opacity="0.8" cx="184.521" cy="315.521" r="132.862" transform="rotate(114.874 184.521 315.521)" fill="url(#paint4_linear_25:217)"></circle>
            <defs>
              <linearGradient id="paint0_linear_25:217" x1="277" y1="-162" x2="277" y2="288" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f97316"></stop>
                <stop offset="1" stopColor="#f97316" stopOpacity="0"></stop>
              </linearGradient>
              <radialGradient id="paint1_radial_25:217" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(17.9997 182) rotate(90) scale(18)">
                <stop stopColor="#f97316"></stop>
                <stop offset="1" stopColor="#f97316" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient id="paint2_radial_25:217" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(76.9997 288) rotate(90) scale(34)">
                <stop stopColor="#f97316"></stop>
                <stop offset="1" stopColor="#f97316" stopOpacity="0"></stop>
              </radialGradient>
              <linearGradient id="paint3_linear_25:217" x1="325.486" y1="122.87" x2="325.486" y2="482.87" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f97316"></stop>
                <stop offset="1" stopColor="#f97316" stopOpacity="0"></stop>
              </linearGradient>
              <linearGradient id="paint4_linear_25:217" x1="184.521" y1="182.659" x2="184.521" y2="448.383" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f97316"></stop>
                <stop offset="1" stopColor="#f97316" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 gap-12 items-center">
          {/* Full Width Column - Text and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-center">
              Find Your Perfect
              <span className="text-primary-300 relative">
                <span className="relative z-10"> Property</span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary-700" viewBox="0 0 138 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 7C20.5 3.5 48.5 1.5 69.5 3.5C90.5 5.5 120 7 137 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
                </svg>
              </span>
            </h1>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed text-center max-w-3xl mx-auto">
              Discover your dream home with our extensive property listings.
              Whether you're looking to buy, rent, or sell, we have the perfect solution for you.
            </p>

            {/* Search Box - Full Width */}
            <div className="bg-dark-700 rounded-xl shadow-xl p-6 mb-8 border border-dark-600 max-w-5xl mx-auto">
              {/* Tabs */}
              <div className="flex mb-6 border-b border-dark-600">
                <button
                  onClick={() => setSearchType('buy')}
                  className={`px-5 py-3 font-medium ${searchType === 'buy' ? 'text-primary-300 border-b-2 border-primary-300' : 'text-gray-300 hover:text-white'}`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setSearchType('rent')}
                  className={`px-5 py-3 font-medium ${searchType === 'rent' ? 'text-primary-300 border-b-2 border-primary-300' : 'text-gray-300 hover:text-white'}`}
                >
                  Rent
                </button>
                <button
                  onClick={() => setSearchType('sell')}
                  className={`px-5 py-3 font-medium ${searchType === 'sell' ? 'text-primary-300 border-b-2 border-primary-300' : 'text-gray-300 hover:text-white'}`}
                >
                  Sell
                </button>
              </div>

              <form onSubmit={handleSearch}>
                {/* Semantic Search Input */}
                <div className="mb-4">
                  <label className="block text-gray-200 mb-2 text-sm font-medium">Semantic Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Describe your ideal property (e.g., 'modern house with garden near schools')"
                      className="w-full bg-dark-800 text-white rounded-lg p-4 pl-12 border border-dark-600 focus:border-primary-400 focus:ring-primary-400 text-lg"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Our AI-powered search understands natural language. Try it!
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-200 mb-2 text-sm font-medium">Location</label>
                    <select
                      className="w-full bg-dark-800 text-white rounded-lg p-3 border border-dark-600 focus:border-primary-400 focus:ring-primary-400"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="">Any Location</option>
                      <option value="London">London</option>
                      <option value="Manchester">Manchester</option>
                      <option value="Birmingham">Birmingham</option>
                      <option value="Edinburgh">Edinburgh</option>
                      <option value="Glasgow">Glasgow</option>
                      <option value="Liverpool">Liverpool</option>
                      <option value="Bristol">Bristol</option>
                      <option value="Leeds">Leeds</option>
                      <option value="Sheffield">Sheffield</option>
                      <option value="Cardiff">Cardiff</option>
                      <option value="Belfast">Belfast</option>
                      <option value="Newcastle">Newcastle</option>
                      <option value="Oxford">Oxford</option>
                      <option value="Cambridge">Cambridge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-200 mb-2 text-sm font-medium">Property Type</label>
                    <select
                      className="w-full bg-dark-800 text-white rounded-lg p-3 border border-dark-600 focus:border-primary-400 focus:ring-primary-400"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                    >
                      <option value="">Any Type</option>
                      <option value="Detached">Detached</option>
                      <option value="Semi-Detached">Semi-Detached</option>
                      <option value="Terraced">Terraced</option>
                      <option value="Flat">Flat</option>
                      <option value="Bungalow">Bungalow</option>
                      <option value="Cottage">Cottage</option>
                      <option value="New Build">New Build</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-200 mb-2 text-sm font-medium">Price Range</label>
                    <select
                      className="w-full bg-dark-800 text-white rounded-lg p-3 border border-dark-600 focus:border-primary-400 focus:ring-primary-400"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                    >
                      <option value="">Any Price</option>
                      <option value="0-200000">Up to £200k</option>
                      <option value="200000-350000">£200k - £350k</option>
                      <option value="350000-500000">£350k - £500k</option>
                      <option value="500000-750000">£500k - £750k</option>
                      <option value="750000-1000000">£750k - £1M</option>
                      <option value="1000000-2000000">£1M - £2M</option>
                      <option value="2000000-999999999">£2M+</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  Search Properties
                </button>
              </form>
            </div>

            {/* Additional space for better layout */}
            <div className="mt-8"></div>
          </motion.div>
        </div>
      </div>

      {/* Add floating animation to tailwind.config.js */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes floatDelayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: floatDelayed 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
}
