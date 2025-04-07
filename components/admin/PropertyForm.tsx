'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PropertiesRecord } from '@/lib/xata';
import { 
  PROPERTY_TYPES, 
  TENURE_TYPES, 
  PROPERTY_STATUS,
  COUNCIL_TAX_BANDS,
  EPC_RATINGS,
  UK_PROPERTY_FEATURES,
  PropertyType,
  TenureType,
  PropertyStatus,
  CouncilTaxBand,
  EPCRating
} from '@/types/uk-property';
import { validateUKPostcode, lookupPostcode } from '@/utils/postcodeService';
import { formatPrice, validatePrice } from '@/utils/priceUtils';
import { getEmbedding } from '@/lib/embedding';

interface PropertyFormProps {
  property?: PropertiesRecord;
}

export default function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  const isEditing = !!property;
  
  // Form state
  const [formData, setFormData] = useState({
    title: property?.title || '',
    price: property?.price?.toString() || '',
    postcode: property?.location?.split(',')[0]?.trim() || '',
    address: property?.location || '',
    description: property?.description || '',
    propertyType: property?.propertyType as PropertyType || '' as PropertyType,
    tenure: property?.tenure as TenureType || '' as TenureType,
    status: property?.status as PropertyStatus || 'for-sale' as PropertyStatus,
    bedrooms: property?.bedrooms?.toString() || '',
    bathrooms: property?.bathrooms?.toString() || '',
    squareFeet: property?.squareFeet?.toString() || '',
    councilTaxBand: '' as CouncilTaxBand, // councilTaxBand is not in PropertiesRecord
    epcRating: property?.epcRating as EPCRating || '' as EPCRating,
    features: property?.features as string[] || [],
    imageUrl: property?.imageUrl || ''
  });
  
  // Form state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [postcodeError, setPostcodeError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Handle feature checkbox changes
  const handleFeatureChange = (featureId: string) => {
    setFormData(prev => {
      const features = [...prev.features];
      
      if (features.includes(featureId)) {
        return { ...prev, features: features.filter(id => id !== featureId) };
      } else {
        return { ...prev, features: [...features, featureId] };
      }
    });
  };
  
  // Handle postcode validation
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
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (!validatePrice(parseInt(formData.price), formData.status)) {
      newErrors.price = 'Invalid price format';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }
    
    if (!formData.tenure) {
      newErrors.tenure = 'Tenure is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    if (formData.bedrooms && isNaN(Number(formData.bedrooms))) {
      newErrors.bedrooms = 'Bedrooms must be a number';
    }
    
    if (formData.bathrooms && isNaN(Number(formData.bathrooms))) {
      newErrors.bathrooms = 'Bathrooms must be a number';
    }
    
    if (formData.squareFeet && isNaN(Number(formData.squareFeet))) {
      newErrors.squareFeet = 'Square feet must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setSuccessMessage(null);
    
    try {
      // Create property data object with only fields that exist in the database schema
      const propertyData: {
        title: string;
        price: number;
        location: string;
        description: string;
        propertyType: PropertyType;
        tenure: TenureType;
        status: PropertyStatus;
        bedrooms?: number;
        bathrooms?: number;
        squareFeet?: number;
        epcRating?: EPCRating;
        features: string[];
        imageUrl: string | null;
        embedding?: number[];
      } = {
        title: formData.title,
        price: parseInt(formData.price),
        location: formData.address,
        description: formData.description,
        propertyType: formData.propertyType,
        tenure: formData.tenure,
        status: formData.status,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : undefined,
        // councilTaxBand is not in the database schema, so we don't include it
        epcRating: formData.epcRating || undefined,
        features: formData.features,
        imageUrl: formData.imageUrl || null
      };
      
      // Generate embedding for semantic search
      try {
        const embeddingText = `${formData.title} ${formData.description} ${formData.propertyType} ${formData.address} ${formData.price}`;
        const embedding = await getEmbedding(embeddingText);
        
        if (embedding) {
          propertyData.embedding = embedding;
        }
      } catch (error) {
        console.error('Error generating embedding:', error);
        // Continue without embedding if there's an error
      }
      
      // API endpoint
      const endpoint = isEditing 
        ? `/api/properties/${property.id}` 
        : '/api/properties';
      
      // HTTP method
      const method = isEditing ? 'PUT' : 'POST';
      
      // Send request
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save property');
      }
      
      const result = await response.json();
      
      setSuccessMessage(isEditing ? 'Property updated successfully!' : 'Property created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/properties');
        router.refresh();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving property:', error);
      setErrors({ submit: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-dark-600">
        <h2 className="text-lg font-medium text-white">
          {isEditing ? 'Edit Property Details' : 'New Property Details'}
        </h2>
      </div>
      
      {/* Form Content */}
      <div className="p-6">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg text-green-400">
            {successMessage}
          </div>
        )}
        
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400">
            {errors.submit}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Property Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full bg-dark-700 border ${
                errors.title ? 'border-red-500' : 'border-dark-600'
              } rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
          </div>
          
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
              Price (£) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full bg-dark-700 border ${
                errors.price ? 'border-red-500' : 'border-dark-600'
              } rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price}</p>}
          </div>
          
          {/* Postcode */}
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-300 mb-1">
              Postcode
            </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              onBlur={handlePostcodeBlur}
              className={`w-full bg-dark-700 border ${
                postcodeError ? 'border-red-500' : 'border-dark-600'
              } rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            />
            {postcodeError && <p className="mt-1 text-sm text-red-400">{postcodeError}</p>}
          </div>
          
          {/* Full Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
              Full Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full bg-dark-700 border ${
                errors.address ? 'border-red-500' : 'border-dark-600'
              } rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address}</p>}
          </div>
          
          {/* Property Type */}
          <div>
            <label htmlFor="propertyType" className="block text-sm font-medium text-gray-300 mb-1">
              Property Type <span className="text-red-400">*</span>
            </label>
            <select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              className={`w-full bg-dark-700 border ${
                errors.propertyType ? 'border-red-500' : 'border-dark-600'
              } rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            >
              <option value="">Select Type</option>
              {PROPERTY_TYPES.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            {errors.propertyType && <p className="mt-1 text-sm text-red-400">{errors.propertyType}</p>}
          </div>
          
          {/* Tenure */}
          <div>
            <label htmlFor="tenure" className="block text-sm font-medium text-gray-300 mb-1">
              Tenure <span className="text-red-400">*</span>
            </label>
            <select
              id="tenure"
              name="tenure"
              value={formData.tenure}
              onChange={handleChange}
              className={`w-full bg-dark-700 border ${
                errors.tenure ? 'border-red-500' : 'border-dark-600'
              } rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            >
              <option value="">Select Tenure</option>
              {TENURE_TYPES.map(tenure => (
                <option key={tenure} value={tenure}>
                  {tenure.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
            {errors.tenure && <p className="mt-1 text-sm text-red-400">{errors.tenure}</p>}
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
              Status <span className="text-red-400">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full bg-dark-700 border ${
                errors.status ? 'border-red-500' : 'border-dark-600'
              } rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            >
              {PROPERTY_STATUS.map(status => (
                <option key={status} value={status}>
                  {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-400">{errors.status}</p>}
          </div>
          
          {/* Bedrooms */}
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-300 mb-1">
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              min="0"
              className={`w-full bg-dark-700 border ${
                errors.bedrooms ? 'border-red-500' : 'border-dark-600'
              } rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            />
            {errors.bedrooms && <p className="mt-1 text-sm text-red-400">{errors.bedrooms}</p>}
          </div>
          
          {/* Bathrooms */}
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-300 mb-1">
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              min="0"
              className={`w-full bg-dark-700 border ${
                errors.bathrooms ? 'border-red-500' : 'border-dark-600'
              } rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            />
            {errors.bathrooms && <p className="mt-1 text-sm text-red-400">{errors.bathrooms}</p>}
          </div>
          
          {/* Square Feet */}
          <div>
            <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-300 mb-1">
              Square Feet
            </label>
            <input
              type="number"
              id="squareFeet"
              name="squareFeet"
              value={formData.squareFeet}
              onChange={handleChange}
              min="0"
              className={`w-full bg-dark-700 border ${
                errors.squareFeet ? 'border-red-500' : 'border-dark-600'
              } rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            />
            {errors.squareFeet && <p className="mt-1 text-sm text-red-400">{errors.squareFeet}</p>}
          </div>
          
          {/* Council Tax Band */}
          <div>
            <label htmlFor="councilTaxBand" className="block text-sm font-medium text-gray-300 mb-1">
              Council Tax Band
            </label>
            <select
              id="councilTaxBand"
              name="councilTaxBand"
              value={formData.councilTaxBand}
              onChange={handleChange}
              className="w-full bg-dark-700 border border-dark-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Band</option>
              {COUNCIL_TAX_BANDS.map(band => (
                <option key={band} value={band}>Band {band}</option>
              ))}
            </select>
          </div>
          
          {/* EPC Rating */}
          <div>
            <label htmlFor="epcRating" className="block text-sm font-medium text-gray-300 mb-1">
              EPC Rating
            </label>
            <select
              id="epcRating"
              name="epcRating"
              value={formData.epcRating}
              onChange={handleChange}
              className="w-full bg-dark-700 border border-dark-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Rating</option>
              {EPC_RATINGS.map(rating => (
                <option key={rating} value={rating}>Rating {rating}</option>
              ))}
            </select>
          </div>
          
          {/* Image URL */}
          <div className="md:col-span-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">
              Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-dark-700 border border-dark-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter a URL for the main property image. For best results, use a landscape image.
            </p>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full bg-dark-700 border border-dark-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>
        
        {/* Features */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Property Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {UK_PROPERTY_FEATURES.map(feature => (
              <div key={feature.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`feature-${feature.id}`}
                  checked={formData.features.includes(feature.id)}
                  onChange={() => handleFeatureChange(feature.id)}
                  className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-dark-600 rounded bg-dark-700"
                />
                <label htmlFor={`feature-${feature.id}`} className="ml-2 text-sm text-gray-300">
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-dark-600 text-white rounded-md hover:bg-dark-500 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Property' : 'Create Property'}
          </button>
        </div>
      </div>
    </form>
  );
}