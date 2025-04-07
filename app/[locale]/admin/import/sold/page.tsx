import BulkPropertyImport from '@/components/BulkPropertyImport';
import LandRegistryImport from '@/components/LandRegistryImport';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ImportSoldPropertiesPage() {
  return (
    <div className="min-h-screen bg-dark-500 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/admin/import"
            className="inline-flex items-center text-primary-400 hover:text-primary-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Import
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Import Sold Properties for Demo
        </h1>

        <p className="text-gray-300 mb-8">
          Use this tool to import sold property data for demonstration purposes. All imported properties will be marked with &quot;sold&quot; status.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
            </ul>
          </div>

          <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
            <h2 className="text-xl font-semibold text-white mb-3">CSV Format</h2>
            <p className="text-gray-300 mb-2">
              Your CSV file should include the following columns:
            </p>
            <div className="bg-dark-800 p-3 rounded-lg overflow-x-auto text-xs mb-4">
              <code className="text-gray-300">
                address, postcode, price, saleDate, propertyType, tenure, bedrooms, bathrooms, squareFeet, description, location, town, district, county
              </code>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Only address, postcode, price, saleDate, propertyType, and tenure are required. Other fields are optional.
            </p>

            <a
              href="/sample-sold-properties.csv"
              download
              className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm w-full"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download Sample CSV
            </a>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
            <Tabs defaultValue="land-registry" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="land-registry" className="text-sm">Land Registry API</TabsTrigger>
                <TabsTrigger value="csv-upload" className="text-sm">CSV Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="land-registry">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-white mb-2">Import from Land Registry API</h3>
                  <p className="text-gray-300 mb-4">
                    Fetch real sold property data directly from the UK Land Registry by entering a postcode.
                  </p>
                </div>
                <LandRegistryImport />
              </TabsContent>

              <TabsContent value="csv-upload">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-white mb-2">Upload CSV File</h3>
                  <p className="text-gray-300 mb-4">
                    Upload a CSV file containing sold property data.
                  </p>
                </div>
                <BulkPropertyImport />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}