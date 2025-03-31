// components/FeaturedPropertiesSection.tsx
import { FeaturedProperty } from '../types/FeaturedProperty';

interface Props {
  properties: FeaturedProperty[];
}

const FeaturedPropertiesSection = ({ properties }: Props) => {
  if (properties.length === 0) {
    return <p className="text-center text-gray-500">No featured properties found.</p>;
  }

  return (
    <section className="px-4 py-12">
      <h2 className="text-3xl font-semibold text-center mb-8">Featured Properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map(property => (
          <div key={property.id} className="bg-white shadow-md rounded overflow-hidden">
            <img
              src={property.imageUrl || '/placeholder.jpg'}
              alt={property.title || 'Property image'}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              <p className="text-gray-600 mb-2">{property.location}</p>
              <p className="text-blue-600 font-bold">${property.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;
