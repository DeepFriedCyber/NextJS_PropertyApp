import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our team of property experts is here to assist you with any inquiries or to schedule a viewing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-gray-900/60 backdrop-blur-lg p-8 md:p-12 rounded-3xl border border-gray-800 shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-primary-400 focus:ring-primary-400"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-primary-400 focus:ring-primary-400"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-primary-400 focus:ring-primary-400"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-primary-400 focus:ring-primary-400"
                    placeholder="+44 123 456 7890"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <select
                    id="subject"
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-primary-400 focus:ring-primary-400"
                  >
                    <option>Property Inquiry</option>
                    <option>Schedule a Viewing</option>
                    <option>Valuation Request</option>
                    <option>Selling Consultation</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-primary-400 focus:ring-primary-400"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-10">
              <div className="bg-gray-900/60 backdrop-blur-lg p-8 rounded-3xl border border-gray-800 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Office Locations</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="text-primary-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">London (Headquarters)</h4>
                      <p className="text-gray-400">123 Property Lane, Mayfair, London, W1J 7NB</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-primary-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Manchester</h4>
                      <p className="text-gray-400">456 Estate Avenue, Manchester, M1 4HD</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/60 backdrop-blur-lg p-8 rounded-3xl border border-gray-800 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="text-primary-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Phone</h4>
                      <p className="text-gray-400">+44 (0) 20 1234 5678</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-primary-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Email</h4>
                      <p className="text-gray-400">info@luxuryproperties.com</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-primary-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Business Hours</h4>
                      <p className="text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-400">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-400">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}