'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DeletePropertyButtonProps {
  propertyId: string;
  className?: string;
}

export default function DeletePropertyButton({ propertyId, className = '' }: DeletePropertyButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete property');
      }
      
      // Redirect to properties list
      router.push('/admin/properties');
      router.refresh();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <TrashIcon className="h-5 w-5 mr-2" />
      {isDeleting ? 'Deleting...' : 'Delete Property'}
    </button>
  );
}