// app/components/FeaturedPropertiesPlaceholder.tsx
'use client';

export default function FeaturedPropertiesPlaceholder() {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Loading featured properties...</p>
        </div>
      </div>
    </section>
  );
}