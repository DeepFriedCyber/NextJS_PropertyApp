// app/page.tsx
import HeroSection from '@/components/HeroSection';
import FeaturedPropertiesSection from '@/components/FeaturedPropertiesSection';
import SemanticSearchBar from '@/components/SemanticSearchBar';
import { fetchFeaturedProperties } from '@/lib/fetchFeaturedProperties';

export default async function HomePage() {
  try {
    const properties = await fetchFeaturedProperties();

    return (
      <div className="min-h-screen">
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <SemanticSearchBar />
          <FeaturedPropertiesSection properties={properties} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading homepage:', error);
    return (
      <div className="min-h-screen">
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-600">
          Unable to load featured properties. Please try again later.
        </div>
      </div>
    );
  }
}


