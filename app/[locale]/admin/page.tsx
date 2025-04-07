import { getXataClient } from '@/lib/xata';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import Link from 'next/link';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  ArrowUpTrayIcon,
  ChartBarIcon,
  CurrencyPoundIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const xata = getXataClient();
  
  // Fetch property statistics
  const propertiesCount = await xata.db.properties.summarize({
    summaries: {
      total: { count: '*' }
    }
  });
  
  // Fetch properties by status
  const propertiesByStatus = await xata.db.properties.summarize({
    columns: ['status'],
    summaries: {
      count: { count: '*' }
    }
  });
  
  // Get status counts
  const statusCounts = {
    'for-sale': 0,
    'for-rent': 0,
    'under-offer': 0,
    'sold': 0,
    'let-agreed': 0
  };
  
  propertiesByStatus.summaries.forEach(summary => {
    // Access status directly from the summary object
    const status = summary.status as keyof typeof statusCounts;
    if (status && status in statusCounts) {
      statusCounts[status] = summary.count;
    }
  });
  
  // Calculate average price
  const priceStats = await xata.db.properties.summarize({
    summaries: {
      avg: { average: 'price' },
      max: { max: 'price' },
      min: { min: 'price' }
    }
  });
  
  const avgPrice = Math.round(priceStats.summaries[0]?.avg || 0);
  
  // Get recent properties
  const recentProperties = await xata.db.properties.sort('xata_createdat', 'desc').getMany({
    pagination: { size: 5 }
  });
  
  // Dashboard cards data
  const cards = [
    {
      title: 'Total Properties',
      value: propertiesCount.summaries[0]?.total || 0,
      icon: BuildingOfficeIcon,
      color: 'bg-blue-500',
      link: '/admin/properties'
    },
    {
      title: 'For Sale',
      value: statusCounts['for-sale'],
      icon: CurrencyPoundIcon,
      color: 'bg-green-500',
      link: '/admin/properties?status=for-sale'
    },
    {
      title: 'For Rent',
      value: statusCounts['for-rent'],
      icon: BuildingOfficeIcon,
      color: 'bg-purple-500',
      link: '/admin/properties?status=for-rent'
    },
    {
      title: 'Recently Sold',
      value: statusCounts['sold'],
      icon: ClockIcon,
      color: 'bg-red-500',
      link: '/admin/properties?status=sold'
    },
    {
      title: 'Average Price',
      value: `£${avgPrice.toLocaleString()}`,
      icon: ChartBarIcon,
      color: 'bg-amber-500',
      link: '/admin/analytics'
    },
    {
      title: 'Clients',
      value: '0',
      icon: UserGroupIcon,
      color: 'bg-indigo-500',
      link: '/admin/clients'
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {session?.user?.name || 'Agent'}</h1>
        <p className="text-gray-400">Here's an overview of your property portfolio</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link 
              key={index} 
              href={card.link}
              className="bg-dark-800 rounded-lg p-6 border border-dark-600 hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-gray-400 text-sm font-medium">{card.title}</h3>
                  <p className="text-white text-2xl font-bold">{card.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <div className="lg:col-span-2 bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-600 flex justify-between items-center">
            <h2 className="text-lg font-medium text-white">Recent Properties</h2>
            <Link href="/admin/properties" className="text-primary-400 text-sm hover:text-primary-300">
              View All
            </Link>
          </div>
          
          <div className="divide-y divide-dark-600">
            {recentProperties.length > 0 ? (
              recentProperties.map((property) => (
                <Link 
                  key={property.id} 
                  href={`/admin/properties/${property.id}`}
                  className="block px-6 py-4 hover:bg-dark-700 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">{property.title}</h3>
                      <p className="text-gray-400 text-sm">{property.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary-300 font-bold">£{property.price?.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 capitalize">
                        {property.status?.replace(/-/g, ' ')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-400">No properties found</p>
                <Link 
                  href="/admin/properties/new" 
                  className="mt-4 inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Add Property
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-600">
            <h2 className="text-lg font-medium text-white">Quick Actions</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <Link 
              href="/admin/properties/new" 
              className="flex items-center p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
            >
              <BuildingOfficeIcon className="h-6 w-6 text-primary-400" />
              <span className="ml-3 text-white">Add New Property</span>
            </Link>
            
            <Link 
              href="/admin/import" 
              className="flex items-center p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
            >
              <ArrowUpTrayIcon className="h-6 w-6 text-primary-400" />
              <span className="ml-3 text-white">Import Properties</span>
            </Link>
            
            <Link 
              href="/admin/clients/new" 
              className="flex items-center p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
            >
              <UserGroupIcon className="h-6 w-6 text-primary-400" />
              <span className="ml-3 text-white">Add New Client</span>
            </Link>
            
            <Link 
              href="/admin/analytics" 
              className="flex items-center p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors"
            >
              <ChartBarIcon className="h-6 w-6 text-primary-400" />
              <span className="ml-3 text-white">View Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}