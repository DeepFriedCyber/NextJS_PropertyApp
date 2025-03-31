'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HeroSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/properties/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
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
          
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter location or property type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 text-lg"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-semibold"
              >
                Search
              </button>
            </div>
          </form>

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
}
