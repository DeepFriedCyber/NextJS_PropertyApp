import { getXataClient } from '@/lib/xata';
import { notFound } from 'next/navigation';
import PropertyForm from '@/components/admin/PropertyForm';

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const xata = getXataClient();
  
  // Fetch the property
  const property = await xata.db.properties.read(id);
  
  if (!property) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Property</h1>
        <p className="text-gray-400">Update property details</p>
      </div>
      
      <PropertyForm property={property} />
    </div>
  );
}