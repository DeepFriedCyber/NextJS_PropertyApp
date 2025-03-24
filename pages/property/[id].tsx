import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";

interface Property {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  location: string;
  description: string;
}

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !id) return;

    async function fetchProperty() {
      try {
        const propertyRef = doc(db, "properties", String(id));
        const propertySnap = await getDoc(propertyRef);

        if (propertySnap.exists()) {
          setProperty({ id: propertySnap.id, ...propertySnap.data() } as Property);
        } else {
          setError("Property not found");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [id, router.isReady]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
      {property.imageUrl && (
        <div className="relative h-[400px] mb-6">
          <Image
            src={property.imageUrl}
            alt={property.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold">${property.price}</h2>
          <p className="text-gray-600">{property.location}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{property.description}</p>
        </div>
      </div>
    </div>
  );
}
