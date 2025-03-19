import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Property {
  id: string;
  name: string;
}

export default function PropertyCard({ property }: { property: Property }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    await supabase.from("favorites").upsert({ user_id: "currentUserId", property_id: property.id });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition hover:shadow-xl">
      <h2 className="text-lg font-bold mt-3">{property.name}</h2>
      <button onClick={toggleFavorite} className="text-red-500 mt-2">
        {isFavorite ? "❤️ Favorited" : "♡ Favorite"}
      </button>
    </div>
  );
}
