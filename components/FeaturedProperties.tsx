// components/FeaturedProperties.tsx
import { Suspense } from 'react';
import { fetchFeaturedProperties } from '@/lib/fetchFeaturedProperties';
import FeaturedPropertiesSection from './FeaturedPropertiesSection';
import LoadingSpinner from './ui/LoadingSpinner';

// This is a Server Component that fetches data
async function FeaturedPropertiesContent() {
  // Fetch data on the server
  const properties = await fetchFeaturedProperties();

  // Render the UI with the fetched data
  return <FeaturedPropertiesSection properties={properties} />;
}

// This is the main component that uses Suspense for loading state
export default function FeaturedProperties() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <FeaturedPropertiesContent />
    </Suspense>
  );
}