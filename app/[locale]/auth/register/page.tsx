'use client';

import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import type { UserType } from '@/types/auth';

export default function RegisterPage() {
  const [userType, setUserType] = useState<UserType>('individual');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700">I am a:</label>
            <div className="mt-2 flex space-x-4">
              <button
                onClick={() => setUserType('individual')}
                className={`px-4 py-2 rounded-md ${
                  userType === 'individual'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Individual
              </button>
              <button
                onClick={() => setUserType('agent')}
                className={`px-4 py-2 rounded-md ${
                  userType === 'agent'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Agent
              </button>
            </div>
          </div>

          <AuthForm type="register" userType={userType} />
        </div>
      </div>
    </div>
  );
}