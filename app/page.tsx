// app/page.tsx
import HeroSection from '@/components/HeroSection';
import FeaturedPropertiesSection from '@/components/FeaturedPropertiesSection';
import StatsSection from '@/components/StatsSection';
import CTASection from '@/components/CTASection';
import { fetchFeaturedProperties } from '@/lib/fetchFeaturedProperties';

export default async function HomePage() {
  const featuredProperties = await fetchFeaturedProperties();

  return (
    <main className="min-h-screen bg-black text-white">
      <HeroSection />
      <FeaturedPropertiesSection properties={featuredProperties} />
      <StatsSection />
      <CTASection />
    </main>
  );
}


