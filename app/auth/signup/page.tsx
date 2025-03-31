import React from "react";
import Link from 'next/link';

export default function SignupSelectionPage() {
  return (
    <div className="max-w-md mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Choose Account Type</h1>
      
      <div className="space-y-4">
        <Link 
          href="/auth/signup/individual"
          className="block w-full p-4 text-center bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Individual Account
          <p className="text-sm mt-1 text-primary-100">
            For home buyers and renters
          </p>
        </Link>

        <Link 
          href="/auth/signup/agent"
          className="block w-full p-4 text-center bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
        >
          Estate Agent Account
          <p className="text-sm mt-1 text-secondary-100">
            For property professionals
          </p>
        </Link>
      </div>
    </div>
  );
}
