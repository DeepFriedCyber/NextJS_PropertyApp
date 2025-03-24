import { useState } from "react";
import { db, auth } from "@/lib/firebaseClient";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import Link from "next/link";
import { Property } from "@/types/property";
import { formatPrice } from '@/utils/priceUtils';

export default function PropertyCard({ property }: { property: Property }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("Please login to favorite properties");
      return;
    }

    try {
      const favoriteRef = doc(db, "favorites", `${userId}_${property.id}`);
      if (isFavorite) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, {
          userId,
          propertyId: property.id,
          createdAt: new Date().toISOString()
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("Failed to update favorite status");
    }
  };

  const getStatusBadgeColor = (status: Property['status']) => {
    switch (status) {
      case 'for-sale':
        return 'bg-green-500';
      case 'for-rent':
        return 'bg-blue-500';
      case 'under-offer':
        return 'bg-orange-500';
      case 'sold':
        return 'bg-red-500';
      case 'let-agreed':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
        <div className="relative">
          <img 
            src={property.imageUrl} 
            alt={property.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite();
              }}
              className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
          </div>
          <div className="absolute bottom-2 left-2">
            <span className={`
              px-2 py-1 rounded-full text-sm font-semibold text-white
              ${getStatusBadgeColor(property.status)}
            `}>
              {property.status === 'for-rent' ? 'TO LET' : 
               property.status === 'let-agreed' ? 'LET AGREED' :
               property.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{property.name}</h2>
          <p className="text-gray-600 mb-2">{property.location}</p>
          <div className="text-xl font-bold">
            {formatPrice(property.price, property.status)}
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 border-t pt-3">
            <div>
              <span className="mr-2">🛏️ {property.bedrooms}</span>
              <span className="mr-2">🚿 {property.bathrooms}</span>
              <span>📏 {property.area}m²</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="capitalize">{property.type}</span>
              {property.epcRating && (
                <span className="bg-gray-100 px-2 py-1 rounded-md">
                  EPC: {property.epcRating}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
