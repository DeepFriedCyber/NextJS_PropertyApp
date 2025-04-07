'use client';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  );
}