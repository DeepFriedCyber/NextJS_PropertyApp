// components/FeaturedPropertiesSection.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FeaturedProperty } from '../types/FeaturedProperty';
import PropertyCard from './PropertyCard';

interface Props {
  properties: FeaturedProperty[];
}

const FeaturedPropertiesSection = ({ properties }: Props) => {
  // Enhance properties directly without state
  const featuredProperties = properties.map(property => ({
    ...property,
    featured: property.featured || false,
    listingType: property.listingType || 'sale'
  }));

  const loading = false; // We're using Suspense for loading now

  return (
    <section className="py-24 bg-dark-600 relative text-white">
      {/* Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-40 bg-dark-500"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Hously-style section heading */}
          <div className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-[1px] w-12 bg-primary-300"></div>
              <span className="text-primary-300 font-medium text-sm uppercase tracking-wider">Featured Listings</span>
              <div className="h-[1px] w-12 bg-primary-300"></div>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Our Featured Properties
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-base">
            Discover our handpicked selection of exceptional properties, chosen for their prime locations,
            outstanding features, and excellent value.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-300"></div>
          </div>
        ) : featuredProperties.length === 0 ? (
          <div className="text-center py-16 bg-dark-700 rounded-lg shadow-sm border border-dark-800">
            <p className="text-lg text-gray-300">No properties available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* View All Properties Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mt-14"
            >
              <Link
                href="/properties"
                className="group px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-all font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                View All Properties
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;
