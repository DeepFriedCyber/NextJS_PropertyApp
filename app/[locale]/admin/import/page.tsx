import FlexiblePropertyImport from '@/components/FlexiblePropertyImport';
import Link from 'next/link';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-dark-500 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-4">
          Import UK Property Data
        </h1>

        <div className="mb-6">
          <Link
            href="/admin/import/sold"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
            Import Sold Properties for Demo
          </Link>
        </div>

        <div className="mb-8">
          <p className="text-gray-300 mb-4">
            Use this flexible import tool to upload your property data in various formats. We've designed it to be as painless as possible, supporting different file types and column names.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
              <h2 className="text-xl font-semibold text-white mb-3">Key Features</h2>
              <ul className="list-disc pl-5 text-gray-300 space-y-2">
                <li>
                  <span className="text-primary-300 font-medium">Multiple File Formats</span> - Upload CSV or Excel files
                </li>
                <li>
                  <span className="text-primary-300 font-medium">Flexible Column Mapping</span> - We'll try to automatically detect your columns
                </li>
                <li>
                  <span className="text-primary-300 font-medium">Smart Data Processing</span> - We'll normalize property types, tenures, and other fields
                </li>
                <li>
                  <span className="text-primary-300 font-medium">Data Preview</span> - Review your data before importing
                </li>
                <li>
                  <span className="text-primary-300 font-medium">Batch Processing</span> - Import large datasets efficiently
                </li>
              </ul>
            </div>

            <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
              <h2 className="text-xl font-semibold text-white mb-3">Data Sources</h2>
              <p className="text-gray-300 mb-2">
                You can obtain UK property sales data from the following sources:
              </p>
              <ul className="list-disc pl-5 text-gray-300 space-y-1">
                <li>
                  <a
                    href="https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-300 hover:text-primary-200 underline"
                  >
                    HM Land Registry Price Paid Data
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.rightmove.co.uk/house-prices.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-300 hover:text-primary-200 underline"
                  >
                    Rightmove Sold Prices
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.zoopla.co.uk/house-prices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-300 hover:text-primary-200 underline"
                  >
                    Zoopla Sold House Prices
                  </a>
                </li>
                <li>
                  <a
                    href="https://propertydata.co.uk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-300 hover:text-primary-200 underline"
                  >
                    PropertyData
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.nethouseprices.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-300 hover:text-primary-200 underline"
                  >
                    Net House Prices
                  </a>
                </li>
              </ul>

              <div className="mt-4 flex flex-col space-y-2">
                <a
                  href="/sample-uk-properties.csv"
                  download
                  className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download Sample CSV
                </a>

                <a
                  href="/sample-uk-properties.xlsx"
                  download
                  className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm w-full"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download Sample Excel
                </a>
              </div>
            </div>
          </div>
        </div>

        <FlexiblePropertyImport />
      </div>
    </div>
  );
}