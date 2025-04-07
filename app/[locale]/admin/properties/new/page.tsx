import PropertyForm from '@/components/admin/PropertyForm';

export default function NewPropertyPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Add New Property</h1>
        <p className="text-gray-400">Create a new property listing</p>
      </div>
      
      <PropertyForm />
    </div>
  );
}