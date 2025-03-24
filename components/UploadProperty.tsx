"use client";

import { useState } from "react";
import { db, storage } from "@/lib/firebaseClient";
import { collection, addDoc } from "firebase/firestore";
import { uploadImage } from "@/utils/uploadImage";
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

export default function UploadProperty() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    postcode: '',
    address: '',
    description: '',
    type: '' as PropertyType,
    tenure: '' as TenureType,
    status: '' as PropertyStatus,
    bedrooms: '',
    bathrooms: '',
    area: '',
    councilTaxBand: '' as CouncilTaxBand,
    epcRating: '' as EPCRating,
    features: [] as string[],
    image: null as File | null
  });

  const [postcodeError, setPostcodeError] = useState('');

  const handlePostcodeBlur = async () => {
    if (!formData.postcode) return;

    try {
      if (!validateUKPostcode(formData.postcode)) {
        setPostcodeError('Invalid UK postcode format');
        return;
      }

      const result = await lookupPostcode(formData.postcode);
      setFormData(prev => ({
        ...prev,
        address: `${prev.address}, ${result.town}, ${result.region}`
      }));
      setPostcodeError('');
    } catch (error) {
      setPostcodeError(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const price = parseFloat(formData.price);
      if (!validatePrice(price, formData.status as PropertyStatus)) {
        throw new Error('Invalid price for this property status');
      }

      if (!validateUKPostcode(formData.postcode)) {
        throw new Error('Invalid UK postcode');
      }

      const imageUrl = formData.image ? await uploadImage(formData.image) : null;

      if (!imageUrl) {
        throw new Error('Image upload failed');
      }

      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        imageUrl,
        createdAt: new Date().toISOString(),
        location: `${formData.address}, ${formData.postcode}`
      };

      const propertiesRef = collection(db, 'properties');
      await addDoc(propertiesRef, propertyData);

      // Reset form
      setFormData({
        name: '',
        price: '',
        postcode: '',
        address: '',
        description: '',
        type: '' as PropertyType,
        tenure: '' as TenureType,
        status: '' as PropertyStatus,
        bedrooms: '',
        bathrooms: '',
        area: '',
        councilTaxBand: '' as CouncilTaxBand,
        epcRating: '' as EPCRating,
        features: [],
        image: null
      });

      alert('Property listed successfully!');
    } catch (error) {
      console.error('Error adding property:', error);
      alert(error.message);
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
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
            value={formData.type}
            onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as PropertyType }))}
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
