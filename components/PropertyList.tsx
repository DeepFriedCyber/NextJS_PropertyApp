'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, query, getDocs, orderBy, limit, startAfter, where, Query, DocumentData } from "firebase/firestore";
import PropertyCard from "./PropertyCard";
import { Property, PropertyFilters, SortOption } from "@/types/property";

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date-newest');
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const propertiesPerPage = 9;

  const buildQuery = () => {
    let q = collection(db, "properties");
    const queryConstraints = [];

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        queryConstraints.push(orderBy('price', 'asc'));
        break;
      case 'price-desc':
        queryConstraints.push(orderBy('price', 'desc'));
        break;
      case 'date-newest':
        queryConstraints.push(orderBy('createdAt', 'desc'));
        break;
      case 'date-oldest':
        queryConstraints.push(orderBy('createdAt', 'asc'));
        break;
    }

    // Filters
    if (filters.type) {
      queryConstraints.push(where('type', '==', filters.type));
    }
    if (filters.status) {
      queryConstraints.push(where('status', '==', filters.status));
    }
    if (filters.minPrice) {
      queryConstraints.push(where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice) {
      queryConstraints.push(where('price', '<=', filters.maxPrice));
    }
    if (filters.minBedrooms) {
      queryConstraints.push(where('bedrooms', '>=', filters.minBedrooms));
    }
    if (filters.location) {
      queryConstraints.push(where('location', '==', filters.location));
    }

    // Pagination
    queryConstraints.push(limit(propertiesPerPage));
    if (lastVisible) {
      queryConstraints.push(startAfter(lastVisible));
    }

    return query(q, ...queryConstraints);
  };

  const fetchProperties = async (resetPagination = false) => {
    if (resetPagination) {
      setLastVisible(null);
      setProperties([]);
    }

    setLoading(true);
    setError(null);

    try {
      const propertyQuery = buildQuery();
      const querySnapshot = await getDocs(propertyQuery);
      
      const propertiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Property[];

      setProperties(prev => resetPagination ? propertiesData : [...prev, ...propertiesData]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(true);
  }, [sortBy, filters]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Filters */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as Property['type'] }))}
            className="p-2 border rounded-lg"
          >
            <option value="">All Property Types</option>
            <option value="detached">Detached</option>
            <option value="semi-detached">Semi-Detached</option>
            <option value="terraced">Terraced</option>
            <option value="flat">Flat</option>
            <option value="bungalow">Bungalow</option>
            <option value="cottage">Cottage</option>
            <option value="maisonette">Maisonette</option>
            <option value="commercial">Commercial</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as Property['status'] }))}
            className="p-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="for-sale">For Sale</option>
            <option value="for-rent">To Let</option>
            <option value="under-offer">Under Offer</option>
            <option value="sold">Sold</option>
            <option value="let-agreed">Let Agreed</option>
          </select>

          <select
            value={filters.tenure}
            onChange={(e) => setFilters(prev => ({ ...prev, tenure: e.target.value as Property['tenure'] }))}
            className="p-2 border rounded-lg"
          >
            <option value="">All Tenures</option>
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
            <option value="share-of-freehold">Share of Freehold</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <input
            type="number"
            placeholder="Min Price (£)"
            onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
            className="p-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Max Price (£)"
            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
            className="p-2 border rounded-lg"
          />
          <input
            type="number"
            placeholder="Min Bedrooms"
            onChange={(e) => setFilters(prev => ({ ...prev, minBedrooms: Number(e.target.value) }))}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Location"
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
            className="p-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Properties Grid */}
      {loading && properties.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-72 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {properties.length >= propertiesPerPage && (
            <div className="text-center mt-8">
              <button
                onClick={() => fetchProperties()}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchProperties(true)}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && properties.length === 0 && (
        <p className="text-center text-gray-500 py-8">No properties found matching your criteria.</p>
      )}
    </div>
  );
}



