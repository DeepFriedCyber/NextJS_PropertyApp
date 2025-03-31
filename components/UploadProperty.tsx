"use client";

import { useState } from "react";
import { getXataClient } from "@/lib/xata";
import { validateUKPostcode, lookupPostcode } from "@/utils/postcodeService";
import { formatPrice, validatePrice } from '@/utils/priceUtils';
import {
  PROPERTY_TYPES,
  TENURE_TYPES,
  PROPERTY_STATUS,
  COUNCIL_TAX_BANDS,
  EPC_RATINGS,
  type PropertyType,
  type TenureType,
  type PropertyStatus,
  type CouncilTaxBand,
  type EPCRating
} from "@/types/uk-property";

interface FormData {
  title: string;
  price: string;
  postcode: string;
  address: string;
  description: string;
  propertyType: PropertyType;
  tenure: TenureType;
  status: PropertyStatus;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  councilTaxBand: CouncilTaxBand;
  epcRating: EPCRating;
  features: string[];
  imageUrl: string | null;
}

export default function UploadProperty() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    price: '',
    postcode: '',
    address: '',
    description: '',
    propertyType: '' as PropertyType,
    tenure: '' as TenureType,
    status: '' as PropertyStatus,
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    councilTaxBand: '' as CouncilTaxBand,
    epcRating: '' as EPCRating,
    features: [],
    imageUrl: null
  });
  const [loading, setLoading] = useState(false);
  const [postcodeError, setPostcodeError] = useState<string | null>(null);

  const handlePostcodeBlur = async () => {
    if (!formData.postcode) {
      setPostcodeError(null);
      return;
    }

    try {
      if (!validateUKPostcode(formData.postcode)) {
        setPostcodeError('Invalid UK postcode format');
        return;
      }

      const postcodeData = await lookupPostcode(formData.postcode);
      setFormData(prev => ({
        ...prev,
        postcode: postcodeData.postcode // Use the formatted postcode
      }));
      setPostcodeError(null);
    } catch (error) {
      setPostcodeError((error as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const xata = getXataClient();
      await xata.db.properties.create({
        title: formData.title,
        price: parseInt(formData.price),
        location: formData.postcode,
        description: formData.description,
        propertyType: formData.propertyType,
        tenure: formData.tenure,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        squareFeet: parseInt(formData.squareFeet),
        features: formData.features,
        imageUrl: formData.imageUrl
      });

      setFormData({
        title: '',
        price: '',
        postcode: '',
        address: '',
        description: '',
        propertyType: '' as PropertyType,
        tenure: '' as TenureType,
        status: '' as PropertyStatus,
        bedrooms: '',
        bathrooms: '',
        squareFeet: '',
        councilTaxBand: '' as CouncilTaxBand,
        epcRating: '' as EPCRating,
        features: [],
        imageUrl: null
      });

      alert('Property listed successfully!');
    } catch (error) {
      console.error('Error adding property:', error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2">Property Name/Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Price (£)</label>
          <input
            type="number"
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Postcode</label>
          <input
            type="text"
            value={formData.postcode}
            onChange={e => setFormData(prev => ({ ...prev, postcode: e.target.value.toUpperCase() }))}
            onBlur={handlePostcodeBlur}
            className={`w-full p-2 border rounded ${postcodeError ? 'border-red-500' : ''}`}
            required
          />
          {postcodeError && <p className="text-red-500 text-sm mt-1">{postcodeError}</p>}
        </div>

        <div>
          <label className="block mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Property Type</label>
          <select
            value={formData.propertyType}
            onChange={e => setFormData(prev => ({ ...prev, propertyType: e.target.value as PropertyType }))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Type</option>
            {PROPERTY_TYPES.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Tenure</label>
          <select
            value={formData.tenure}
            onChange={e => setFormData(prev => ({ ...prev, tenure: e.target.value as TenureType }))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Tenure</option>
            {TENURE_TYPES.map(tenure => (
              <option key={tenure} value={tenure}>
                {tenure.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Council Tax Band</label>
          <select
            value={formData.councilTaxBand}
            onChange={e => setFormData(prev => ({ ...prev, councilTaxBand: e.target.value as CouncilTaxBand }))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Band</option>
            {COUNCIL_TAX_BANDS.map(band => (
              <option key={band} value={band}>Band {band}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">EPC Rating</label>
          <select
            value={formData.epcRating}
            onChange={e => setFormData(prev => ({ ...prev, epcRating: e.target.value as EPCRating }))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Rating</option>
            {EPC_RATINGS.map(rating => (
              <option key={rating} value={rating}>Rating {rating}</option>
            ))}
          </select>
        </div>

        {/* Continue with other fields... */}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors"
      >
        {loading ? 'Uploading...' : 'List Property'}
      </button>
    </form>
  );
}


