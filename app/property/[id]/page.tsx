// app/property/[id]/page.tsx
import { getXataClient } from '@/lib/xata';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import PropertyChat from '@/components/PropertyChat'; // ✅ your client component

interface Props {
  params: { id: string };
}

export default async function PropertyPage({ params }: Props) {
  const xata = getXataClient();
  const property = await xata.db.properties.read(params.id);

  if (!property) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
      <p className="text-gray-600 mb-2">{property.location}</p>
      <p className="text-blue-600 font-semibold text-xl mb-6">£{property.price?.toLocaleString()}</p>

      {property.imageUrl && (
        <Image
          src={property.imageUrl}
          alt={property.title || 'Property image'}
          width={800}
          height={500}
          className="w-full object-cover rounded-md mb-6"
        />
      )}

      <ul className="grid grid-cols-2 gap-4 mb-8 text-sm">
        <li><strong>Bedrooms:</strong> {property.bedrooms}</li>
        <li><strong>Bathrooms:</strong> {property.bathrooms}</li>
        <li><strong>Square Feet:</strong> {property.squareFeet}</li>
        <li><strong>Type:</strong> {property.propertyType}</li>
        <li><strong>Tenure:</strong> {property.tenure}</li>
        <li><strong>Listing Agent:</strong> {property.listingAgent}</li>
      </ul>

      <div className="prose max-w-none">
        <p>{property.description}</p>
      </div>

      <PropertyChat propertyId={params.id} /> {/* ✅ Works perfectly now */}
    </div>
  );
}
