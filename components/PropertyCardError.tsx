export default function PropertyCardError() {
  return (
    <div className="bg-dark-700 rounded-xl border border-dark-600 p-5">
      <div className="flex flex-col items-center justify-center text-center">
        <svg className="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-semibold text-white mb-2">Error Loading Property</h3>
        <p className="text-gray-400">We couldn't load this property. Please try again later.</p>
      </div>
    </div>
  );
} 