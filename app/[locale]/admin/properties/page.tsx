import { getXataClient } from '@/lib/xata';
import Link from 'next/link';
import { PlusIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import PropertyStatusBadge from '@/components/admin/PropertyStatusBadge';
import PropertyListItem from '@/components/admin/PropertyListItem';
import PropertyFilters from '@/components/admin/PropertyFilters';

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const xata = getXataClient();
  
  // Parse filters from search params
  const status = searchParams.status as string | undefined;
  const type = searchParams.type as string | undefined;
  const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice as string) : undefined;
  const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice as string) : undefined;
  const minBeds = searchParams.minBeds ? parseInt(searchParams.minBeds as string) : undefined;
  const search = searchParams.search as string | undefined;
  
  // Build filter
  const filter: any = {};
  
  if (status) {
    filter.status = status;
  }
  
  if (type) {
    filter.propertyType = type;
  }
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$ge = minPrice;
    if (maxPrice) filter.price.$le = maxPrice;
  }
  
  if (minBeds) {
    filter.bedrooms = { $ge: minBeds };
  }
  
  if (search) {
    filter.$any = [
      { title: { $contains: search } },
      { description: { $contains: search } },
      { location: { $contains: search } }
    ];
  }
  
  // Fetch properties with filters
  const properties = await xata.db.properties
    .filter(Object.keys(filter).length > 0 ? filter : {})
    .sort('xata_createdat', 'desc')
    .getMany();
  
  // Get property counts by status for the filter tabs
  const propertiesByStatus = await xata.db.properties.summarize({
    columns: ['status'],
    summaries: {
      count: { count: '*' }
    }
  });
  
  // Create status counts object
  const statusCounts: Record<string, number> = {
    'all': properties.length,
    'for-sale': 0,
    'for-rent': 0,
    'under-offer': 0,
    'sold': 0,
    'let-agreed': 0
  };
  
  propertiesByStatus.summaries.forEach(summary => {
    const status = summary.status as string;
    if (status) {
      statusCounts[status] = summary.count;
    }
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Properties</h1>
          <p className="text-gray-400">Manage your property listings</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Property
          </Link>
          
          <Link
            href="/admin/import"
            className="inline-flex items-center px-4 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Import
          </Link>
        </div>
      </div>
      
      {/* Status Tabs */}
      <div className="mb-6 border-b border-dark-600">
        <div className="flex overflow-x-auto">
          {Object.entries(statusCounts).map(([statusKey, count]) => (
            <Link
              key={statusKey}
              href={statusKey === 'all' ? '/admin/properties' : `/admin/properties?status=${statusKey}`}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                (statusKey === 'all' && !status) || status === statusKey
                  ? 'text-primary-300 border-b-2 border-primary-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {statusKey === 'all' ? 'All Properties' : (
                <span className="capitalize">{statusKey.replace(/-/g, ' ')}</span>
              )}
              <span className="ml-2 text-xs bg-dark-600 text-gray-300 px-2 py-1 rounded-full">
                {count}
              </span>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <PropertyFilters 
            currentFilters={{
              type,
              minPrice,
              maxPrice,
              minBeds,
              search
            }}
          />
        </div>
        
        {/* Property List */}
        <div className="lg:col-span-3">
          {properties.length > 0 ? (
            <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
              <div className="grid grid-cols-1 divide-y divide-dark-600">
                {properties.map((property) => (
                  <PropertyListItem key={property.id} property={property} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-dark-800 rounded-lg border border-dark-600 p-8 text-center">
              <h3 className="text-lg font-medium text-white mb-2">No properties found</h3>
              <p className="text-gray-400 mb-6">
                {Object.keys(filter).length > 0 
                  ? 'Try adjusting your filters or search criteria'
                  : 'Get started by adding your first property'}
              </p>
              
              <div className="flex justify-center space-x-4">
                {Object.keys(filter).length > 0 && (
                  <Link
                    href="/admin/properties"
                    className="px-4 py-2 bg-dark-600 text-white rounded-lg hover:bg-dark-500 transition-colors"
                  >
                    Clear Filters
                  </Link>
                )}
                
                <Link
                  href="/admin/properties/new"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Add Property
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}