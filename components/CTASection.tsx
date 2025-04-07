'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTASection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    propertyType: 'Any',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormState({
          name: '',
          email: '',
          phone: '',
          message: '',
          propertyType: 'Any',
        });
      }, 3000);
    }, 1500);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-dark-800 to-dark-700 opacity-95"></div>
      {/* Removed missing image reference and using a pattern instead */}
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary-800 to-primary-900"></div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/3"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-6">
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-12 bg-white opacity-50"></div>
                <span className="text-white font-medium text-sm uppercase tracking-wider">Take Action</span>
                <div className="h-[1px] w-12 bg-white opacity-50"></div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Ready to Find Your <span className="relative">
                Dream Home?
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary-300 opacity-50" viewBox="0 0 138 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 7C20.5 3.5 48.5 1.5 69.5 3.5C90.5 5.5 120 7 137 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
                </svg>
              </span>
            </h2>

            <p className="text-white/80 text-lg mb-8 max-w-lg">
              Whether you're looking to buy, sell, or rent, our team of experienced agents is here to help you every step of the way.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Personalized Property Matching</h3>
                  <p className="text-white/70">Our AI-powered search finds properties that match your exact requirements.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Expert Guidance</h3>
                  <p className="text-white/70">Our property experts will guide you through every step of your journey.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Exclusive Listings</h3>
                  <p className="text-white/70">Access properties not available on other platforms.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/properties"
                className="px-6 py-3 bg-white text-primary-600 rounded-md hover:bg-gray-100 transition-colors font-medium shadow-md flex items-center gap-2 group"
              >
                Browse Properties
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white/10 transition-colors font-medium"
              >
                Get Started Today
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:text-right"
          >
            <div className="bg-white rounded-xl p-8 shadow-xl max-w-md mx-auto lg:ml-auto relative overflow-hidden">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary-50 rounded-bl-3xl"></div>

              <div className="relative">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Chat With Our AI Assistant</h3>
                <p className="text-gray-500 mb-6">Get instant answers to your property questions and personalized recommendations.</p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm w-full">
                      <p className="text-gray-700 text-sm">How can I help you find your perfect property today?</p>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask about properties, locations, or services..."
                    className="w-full p-4 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Our AI assistant is available 24/7 to answer your questions and help you find your dream property.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

