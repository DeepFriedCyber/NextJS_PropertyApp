import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-500">The page you are looking for does not exist.</p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}