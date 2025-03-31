'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/luxury-home.jpg')] bg-cover bg-center"></div>
      <div className="relative container mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold mb-6 text-white">Ready to Find Your Dream Home?</h2>
        <p className="text-xl mb-8 text-gold-400 max-w-2xl mx-auto">
          Join thousands of satisfied customers who found their perfect property. Let us help you start your journey home.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block px-8 py-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-semibold transform hover:-translate-y-1 duration-200 shadow-xl"
        >
          Get Started Today
        </Link>
      </div>
    </section>
  );
}

