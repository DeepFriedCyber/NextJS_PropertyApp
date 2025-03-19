import { useEffect, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/utils/supabaseClient"; // ✅ Import from utils

// Define Property Type
interface Property {
  id: string;
  name: string;
  price: number;
  location: string;
  imageUrl: string;
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]); // ✅ Type Defined
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from("properties").select("*");

        if (search) query = query.ilike("name", `%${search}%`);
        if (locationFilter) query = query.eq("location", locationFilter);
        if (minPrice) query = query.gte("price", Number(minPrice));
        if (maxPrice) query = query.lte("price", Number(maxPrice));

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching properties:", error);
          setError("Failed to load properties.");
          return;
        }

        setProperties(data as Property[]); // ✅ Type Casting
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [search, locationFilter, minPrice, maxPrice]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Find Your Dream Home</h1>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        >
          <option value="">All Locations</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Austin">Austin</option>
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        />
      </div>

      {/* Loading & Error States */}
      {loading && <p>Loading properties...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          !loading && <p>No properties found.</p>
        )}
      </div>
    </div>
  );
}
