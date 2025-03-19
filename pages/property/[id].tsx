import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

// ✅ Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ Define Property Type
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

  // ✅ Ensure the router is ready before fetching
  useEffect(() => {
    if (!router.isReady || !id) return;

    async function fetchProperty() {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", String(id))
        .single();

      if (error) {
        console.error("Error fetching property:", error);
      } else {
        setProperty(data);
      }
    }

    fetchProperty();
  }, [id, router.isReady]); // ✅ Ensures Next.js has finished loading query params

  if (!property) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Image
        src={property.imageUrl}
        alt={property.name}
        width={800}
        height={400}
        className="rounded-lg"
      />
      <h1 className="text-3xl font-bold mt-4">{property.name}</h1>
      <p className="text-lg text-primary font-semibold">
        ${property.price.toLocaleString()}
      </p>
      <p className="text-muted text-sm">{property.location}</p>
      <p className="mt-4">{property.description}</p>
    </div>
  );
}
