'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  return (
    <header className="bg-dark-800 border-b border-dark-600 py-4 px-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Agent Dashboard</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-dark-700 focus:outline-none">
            <BellIcon className="h-6 w-6" />
          </button>
          
          {/* Messages */}
          <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-dark-700 focus:outline-none">
            <EnvelopeIcon className="h-6 w-6" />
          </button>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white overflow-hidden">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{user.name?.charAt(0) || user.email?.charAt(0) || 'U'}</span>
                  )}
                </div>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-white">{user.name || 'User'}</div>
                <div className="text-xs text-gray-400">{user.email || ''}</div>
              </div>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-dark-700 rounded-md shadow-lg py-1 z-10 border border-dark-600">
                <Link
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-600"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-600"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>
                <div className="border-t border-dark-600"></div>
                <Link
                  href="/api/auth/signout"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-dark-600"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Sign Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}