'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';

export default function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="bg-dark-700 shadow-md text-white border-b border-dark-600">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Logo/Home */}
          <Link href="/" className="text-xl font-bold text-primary-300">
            Property App
          </Link>

          {/* Middle - Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/search" className="text-gray-300 hover:text-primary-300">
              Search
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/favorites" className="text-gray-300 hover:text-primary-300">
                  Favorites
                </Link>
                <Link href="/admin/import" className="text-gray-300 hover:text-primary-300">
                  Import Data
                </Link>
              </>
            )}
          </div>

          {/* Right side - Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="text-sm text-gray-300">Loading...</div>
            ) : isAuthenticated ? (
              <>
                <span className="text-sm text-gray-300">{user?.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-primary-300 hover:text-primary-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
