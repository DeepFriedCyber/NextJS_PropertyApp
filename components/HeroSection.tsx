import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Find Your Dream Property
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Discover the perfect home that matches your lifestyle
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/properties"
            className="px-8 py-3 bg-white text-primary-500 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
          >
            Browse Properties
          </Link>
          <Link 
            href="/auth/signup"
            className="px-8 py-3 bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-primary-500 transition-all font-semibold"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
