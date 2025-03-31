import PropertyList from '@/components/PropertyList';

export default function PropertiesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">All Properties</h1>
      <PropertyList />
    </main>
  );
}