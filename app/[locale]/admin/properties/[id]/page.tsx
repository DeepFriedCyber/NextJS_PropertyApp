import { getXataClient } from '@/lib/xata';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PropertyStatusBadge from '@/components/admin/PropertyStatusBadge';
import DeletePropertyButton from '@/components/admin/DeletePropertyButton';
import { PropertyStatus } from '@/types/uk-property';
import {
  PencilIcon,
  ArrowLeftIcon,
  HomeIcon,
  MapPinIcon,
  CurrencyPoundIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

export default async function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const xata = getXataClient();
  
  // Fetch the property
  const property = await xata.db.properties.read(id);
  
  if (!property) {
    notFound();
  }
  
  // Format date
  const createdDate = new Date(property.xata_createdat).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/properties"
            className="mr-4 p-2 bg-dark-600 rounded-full text-gray-300 hover:bg-dark-500 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          
          <div>
            <h1 className="text-2xl font-bold text-white">{property.title}</h1>
            <p className="text-gray-400 flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {property.location}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href={`/admin/properties/${id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </Link>
          
          <Link
            href={`/property/${id}`}
            className="inline-flex items-center px-4 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors"
            target="_blank"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            View Listing
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Image */}
          <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
            <div className="h-[400px] relative bg-dark-700 flex items-center justify-center">
              {property.imageUrl ? (
                <Image
                  src={property.imageUrl}
                  alt={property.title || 'Property'}
                  fill
                  className="object-cover"
                />
              ) : (
                <HomeIcon className="h-24 w-24 text-dark-600" />
              )}
            </div>
          </div>
          
          {/* Property Description */}
          <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
            <div className="px-6 py-4 border-b border-dark-600 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
              <h2 className="text-lg font-medium text-white">Description</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-300 whitespace-pre-line">
                {property.description || 'No description provided.'}
              </p>
            </div>
          </div>
          
          {/* Property Features */}
          <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
            <div className="px-6 py-4 border-b border-dark-600">
              <h2 className="text-lg font-medium text-white">Features</h2>
            </div>
            
            <div className="p-6">
              {property.features && property.features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary-500 mr-2"></div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No features listed.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Property Details */}
          <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
            <div className="px-6 py-4 border-b border-dark-600">
              <h2 className="text-lg font-medium text-white">Property Details</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-dark-600">
                <span className="text-gray-400">Status</span>
                <PropertyStatusBadge status={property.status as PropertyStatus} />
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-dark-600">
                <span className="text-gray-400">Price</span>
                <span className="text-xl font-bold text-primary-300">£{property.price?.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-dark-600">
                <span className="text-gray-400">Property Type</span>
                <span className="text-white capitalize">{property.propertyType}</span>
              </div>
              
              <div className="flex justify-between items-center pb-3 border-b border-dark-600">
                <span className="text-gray-400">Tenure</span>
                <span className="text-white capitalize">{property.tenure?.replace(/-/g, ' ')}</span>
              </div>
              
              {property.bedrooms && (
                <div className="flex justify-between items-center pb-3 border-b border-dark-600">
                  <span className="text-gray-400">Bedrooms</span>
                  <span className="text-white">{property.bedrooms}</span>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="flex justify-between items-center pb-3 border-b border-dark-600">
                  <span className="text-gray-400">Bathrooms</span>
                  <span className="text-white">{property.bathrooms}</span>
                </div>
              )}
              
              {property.squareFeet && (
                <div className="flex justify-between items-center pb-3 border-b border-dark-600">
                  <span className="text-gray-400">Square Feet</span>
                  <span className="text-white">{property.squareFeet.toLocaleString()}</span>
                </div>
              )}
              
              {/* Council Tax Band is not in the database schema */}
              
              {property.epcRating && (
                <div className="flex justify-between items-center pb-3 border-b border-dark-600">
                  <span className="text-gray-400">EPC Rating</span>
                  <span className="text-white">Rating {property.epcRating}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Added</span>
                <span className="text-white">{createdDate}</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
            <div className="px-6 py-4 border-b border-dark-600">
              <h2 className="text-lg font-medium text-white">Actions</h2>
            </div>
            
            <div className="p-6 space-y-3">
              <Link
                href={`/admin/properties/${id}/edit`}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Property
              </Link>
              
              <Link
                href={`/property/${id}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors"
                target="_blank"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                View Public Listing
              </Link>
              
              <DeletePropertyButton
                propertyId={id}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}