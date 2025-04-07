'use client';

import { useState } from 'react';
import { UKSoldPropertyData } from '@/utils/propertyDataImport';

export default function LandRegistryImport() {
  const [postcode, setPostcode] = useState('');
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [properties, setProperties] = useState<UKSoldPropertyData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importResults, setImportResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: { index: number; error: string }[];
  } | null>(null);

  // Fetch properties from Land Registry API
  const fetchProperties = async () => {
    if (!postcode) {
      setError('Please enter a postcode');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProperties([]);
    setImportResults(null);

    try {
      const response = await fetch(`/api/land-registry?postcode=${encodeURIComponent(postcode)}&limit=${limit}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch properties');
      }
      
      const data = await response.json();
      
      if (data.properties && data.properties.length > 0) {
        setProperties(data.properties);
      } else {
        setError('No properties found for this postcode');
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Import properties to the database
  const importProperties = async () => {
    if (properties.length === 0) {
      setError('No properties to import');
      return;
    }

    setIsImporting(true);
    setError(null);
    setImportResults(null);

    try {
      const response = await fetch('/api/land-registry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import properties');
      }
      
      const results = await response.json();
      setImportResults(results);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-dark-700 rounded-xl shadow-xl p-6 border border-dark-600 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Import from Land Registry</h2>
      
      <div className="mb-6">
        <div className="bg-amber-900/30 p-4 rounded-lg border border-amber-800/50 mb-4">
          <h3 className="text-amber-300 font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Land Registry Data
          </h3>
          <p className="text-gray-300">
            This tool fetches real sold property data from the UK Land Registry. All properties will be marked as <span className="text-red-400 font-medium">sold</span> and imported for demonstration purposes.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-200 mb-2 text-sm font-medium">Postcode</label>
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.toUpperCase())}
            placeholder="e.g. SW1A 1AA"
            className="w-full bg-dark-800 text-white rounded-lg p-2 border border-dark-600 focus:border-primary-400 focus:ring-primary-400"
          />
          <p className="mt-1 text-xs text-gray-400">
            Enter a UK postcode to fetch sold property data
          </p>
        </div>
        
        <div>
          <label className="block text-gray-200 mb-2 text-sm font-medium">Number of Properties</label>
          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="w-full bg-dark-800 text-white rounded-lg p-2 border border-dark-600 focus:border-primary-400 focus:ring-primary-400"
          >
            <option value={5}>5 properties</option>
            <option value={10}>10 properties</option>
            <option value={20}>20 properties</option>
            <option value={50}>50 properties</option>
          </select>
          <p className="mt-1 text-xs text-gray-400">
            Select how many properties to fetch
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={fetchProperties}
          disabled={isLoading || !postcode}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching...
            </>
          ) : (
            'Fetch Properties'
          )}
        </button>
        
        <button
          onClick={importProperties}
          disabled={isImporting || properties.length === 0}
          className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isImporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Importing...
            </>
          ) : (
            'Import Properties'
          )}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-900/30 p-4 rounded-lg border border-red-800/50 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      
      {properties.length > 0 && !importResults && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-white">Found {properties.length} Properties</h3>
            <div className="text-sm text-gray-400">
              All properties will be imported as <span className="text-red-400 font-medium">sold</span>
            </div>
          </div>

          <div className="bg-dark-800 p-4 rounded-lg border border-dark-600 mb-4">
            <p className="text-gray-300 mb-2">
              These properties were found in the Land Registry database for postcode <span className="font-medium text-primary-300">{postcode}</span>.
              Some data like bedrooms, bathrooms, and square footage is not available from Land Registry and will be generated with random values.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-dark-800 border border-dark-600 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Address</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Postcode</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Sale Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Tenure</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-dark-700' : 'bg-dark-800'}>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600">{property.address}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600">{property.postcode}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600">£{property.price?.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600">{new Date(property.saleDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600 capitalize">{property.propertyType}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600 capitalize">{property.tenure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-dark-900 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="font-medium text-primary-300">Note:</span> The Land Registry data is official UK government data of actual property sales.
            </p>
          </div>
        </div>
      )}
      
      {importResults && (
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
          <h3 className="text-lg font-medium text-white mb-3">Import Results</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-dark-700 p-3 rounded-lg">
              <p className="text-sm text-gray-300">Total</p>
              <p className="text-2xl font-bold text-white">{importResults.total}</p>
            </div>
            <div className="bg-green-900/30 p-3 rounded-lg">
              <p className="text-sm text-gray-300">Successful</p>
              <p className="text-2xl font-bold text-green-400">{importResults.successful}</p>
            </div>
            <div className="bg-red-900/30 p-3 rounded-lg">
              <p className="text-sm text-gray-300">Failed</p>
              <p className="text-2xl font-bold text-red-400">{importResults.failed}</p>
            </div>
          </div>
          
          {importResults.errors.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-white mb-2">Errors</h4>
              <div className="max-h-40 overflow-y-auto bg-dark-900 rounded-lg p-2">
                {importResults.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-400 mb-1">
                    <span className="font-medium">Row {error.index + 1}:</span> {error.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}