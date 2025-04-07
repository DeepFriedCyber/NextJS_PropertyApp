'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  Cog6ToothIcon, 
  ArrowUpTrayIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Properties', href: '/admin/properties', icon: BuildingOfficeIcon },
    { name: 'Import Data', href: '/admin/import', icon: ArrowUpTrayIcon },
    { name: 'Clients', href: '/admin/clients', icon: UserGroupIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Documents', href: '/admin/documents', icon: DocumentTextIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-dark-600 text-gray-300 hover:bg-dark-500 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Sidebar */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden bg-dark-900 bg-opacity-80 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-dark-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 border-b border-dark-600">
              <h1 className="text-xl font-bold text-primary-300">Agent Dashboard</h1>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-900/40 text-primary-300'
                        : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            <div className="p-4 border-t border-dark-600">
              <Link
                href="/api/auth/signout"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-dark-700 hover:text-white"
              >
                <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-dark-600 bg-dark-800">
          <div className="flex items-center justify-center h-16 border-b border-dark-600">
            <h1 className="text-xl font-bold text-primary-300">Agent Dashboard</h1>
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-900/40 text-primary-300'
                      : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-dark-600">
            <Link
              href="/api/auth/signout"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-dark-700 hover:text-white"
            >
              <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}