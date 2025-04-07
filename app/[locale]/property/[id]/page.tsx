// app/property/[id]/page.tsx
import { getXataClient } from '@/lib/xata';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PropertyChat from '@/components/PropertyChat';
import SemanticSearchBox from '@/components/SemanticSearchBox';

interface Props {
  params: { id: string };
}

export default async function PropertyPage({ params }: Props) {
  const xata = getXataClient();
  const property = await xata.db.properties.read(params.id);

  if (!property) return notFound();

  // Format price with commas
  const formattedPrice = property.price?.toLocaleString() || '0';

  // Determine if property is for sale or rent
  const isForSale = property.status !== 'for-rent' && property.status !== 'let-agreed';

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Property Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Link href="/" className="hover:text-primary-500">Home</Link>
                <span>/</span>
                <Link href="/properties" className="hover:text-primary-500">Properties</Link>
                <span>/</span>
                <span className="text-primary-500">Details</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{property.title}</h1>
              <div className="flex items-center mt-2">
                <svg className="w-5 h-5 text-primary-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span className="text-gray-600">{property.location}</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-500">
                {isForSale ? 'For Sale' : 'To Let'}
              </span>
              <span className="text-3xl font-bold text-primary-500">
                £{formattedPrice}
                {!isForSale && <span className="text-sm text-gray-500 ml-1">pcm</span>}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Image */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              {property.imageUrl ? (
                <div className="relative h-[400px]">
                  <Image
                    src={property.imageUrl}
                    alt={property.title || 'Property image'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 h-[400px] flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Property Features */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Features</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-primary-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  <span className="text-sm text-gray-500">Bedrooms</span>
                  <span className="font-semibold text-gray-800">{property.bedrooms || 0}</span>
                </div>

                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-primary-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                  <span className="text-sm text-gray-500">Bathrooms</span>
                  <span className="font-semibold text-gray-800">{property.bathrooms || 0}</span>
                </div>

                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-primary-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                  </svg>
                  <span className="text-sm text-gray-500">Area</span>
                  <span className="font-semibold text-gray-800">{property.squareFeet || 0} sq ft</span>
                </div>

                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  <svg className="w-6 h-6 text-primary-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="font-semibold text-gray-800">{property.propertyType || 'Residential'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tenure:</span>
                  <span className="font-medium text-gray-800">{property.tenure || 'Not specified'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Listing Agent:</span>
                  <span className="font-medium text-gray-800">{property.listingAgent || 'Estate Agent'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-gray-800">{property.status || 'Available'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Listed:</span>
                  <span className="font-medium text-gray-800">
                    {property.xata?.createdAt ? new Date(property.xata.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            </div>

            {/* Property Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
              <div className="prose max-w-none text-gray-600">
                <p>{property.description || 'No description available for this property.'}</p>
              </div>
            </div>

            {/* Property Chat */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ask About This Property</h2>
              <PropertyChat propertyId={params.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Semantic Search Box */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Find Similar Properties</h3>
              <SemanticSearchBox initialQuery={`properties similar to ${property.title} in ${property.location}`} />
            </div>

            {/* Agent Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Listing Agent</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">{property.listingAgent || 'Estate Agent'}</h4>
                  <p className="text-sm text-gray-500">Property Consultant</p>
                </div>
              </div>
              <div className="space-y-3">
                <a href="tel:+441234567890" className="flex items-center gap-2 text-gray-600 hover:text-primary-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  +44 123 456 7890
                </a>
                <a href="mailto:agent@example.com" className="flex items-center gap-2 text-gray-600 hover:text-primary-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  agent@example.com
                </a>
              </div>
              <div className="mt-6">
                <button className="w-full bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600 transition-colors">
                  Contact Agent
                </button>
              </div>
            </div>

            {/* Share Property */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Share This Property</h3>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
