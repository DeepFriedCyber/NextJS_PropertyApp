// components/FeaturedPropertiesSection.tsx
import Image from 'next/image';
import Link from 'next/link';
import { FeaturedProperty } from '../types/FeaturedProperty';

interface Props {
  properties: FeaturedProperty[];
}

const FeaturedPropertiesSection = ({ properties }: Props) => {
  if (properties.length === 0) {
    return (
      <section className="px-4 py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">Featured Properties</h2>
          <p className="text-center text-gray-500">No featured properties found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our selection of premium properties, each offering unique features and exceptional value.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <Link 
              href={`/property/${property.id}`} 
              key={property.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={property.imageUrl || '/placeholder.jpg'}
                  alt={property.title || 'Property image'}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
                  {property.title}
                </h3>
                <p className="text-gray-600 mb-4">{property.location}</p>
                <div className="flex items-center justify-between">
                  <p className="text-primary-600 font-bold text-xl">
                    ${property.price.toLocaleString()}
                  </p>
                  <span className="text-sm text-gray-500">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-block px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-semibold"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;
