// app/components/FeaturedProperties.tsx
import { fetchFeaturedProperties } from '@/lib/fetchFeaturedProperties';
import FeaturedPropertiesSection from './FeaturedPropertiesSection';

// This is a Server Component that fetches data
export default async function FeaturedProperties() {
  // Fetch data on the server
  const properties = await fetchFeaturedProperties();

  // Render the UI with the fetched data
  return <FeaturedPropertiesSection properties={properties} />;
}