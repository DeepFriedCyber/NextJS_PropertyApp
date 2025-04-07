'use client';

import { useState, useRef } from 'react';
import { parseCSV, importSoldProperties, UKSoldPropertyData } from '@/utils/propertyDataImport';

export default function BulkPropertyImport() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: { index: number; error: string }[];
  } | null>(null);
  const [previewData, setPreviewData] = useState<UKSoldPropertyData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadResults(null);
      
      // Read file for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvText = event.target?.result as string;
          const parsedData = parseCSV(csvText);
          setPreviewData(parsedData.slice(0, 5)); // Preview first 5 records
          setShowPreview(true);
        } catch (error) {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file. Please check the format.');
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const csvText = event.target?.result as string;
          const properties = parseCSV(csvText);
          
          // Process in batches to show progress
          const batchSize = 10;
          const totalBatches = Math.ceil(properties.length / batchSize);
          let processedCount = 0;
          let results = {
            total: properties.length,
            successful: 0,
            failed: 0,
            errors: [] as { index: number; error: string }[]
          };
          
          for (let i = 0; i < properties.length; i += batchSize) {
            const batch = properties.slice(i, i + batchSize);
            const batchResults = await importSoldProperties(batch);
            
            // Update results
            results.successful += batchResults.successful;
            results.failed += batchResults.failed;
            results.errors = [...results.errors, ...batchResults.errors.map(err => ({
              index: i + err.index,
              error: err.error
            }))];
            
            // Update progress
            processedCount += batch.length;
            setUploadProgress(Math.round((processedCount / properties.length) * 100));
          }
          
          setUploadResults(results);
        } catch (error) {
          console.error('Error processing CSV:', error);
          alert(`Error processing CSV: ${(error as Error).message}`);
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error reading file:', error);
      alert(`Error reading file: ${(error as Error).message}`);
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setUploadResults(null);
    setPreviewData([]);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-dark-700 rounded-xl shadow-xl p-6 border border-dark-600 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Import Sold Properties for Demo</h2>

      <div className="mb-6">
        <div className="bg-amber-900/30 p-4 rounded-lg border border-amber-800/50 mb-4">
          <h3 className="text-amber-300 font-medium mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Demo Data Notice
          </h3>
          <p className="text-gray-300">
            All properties imported here will be marked as <span className="text-red-400 font-medium">sold</span> and will be used for demonstration purposes only.
          </p>
        </div>

        <p className="text-gray-300 mb-4">
          Upload a CSV file containing UK sold property data. The file should include the following columns:
        </p>
        <div className="bg-dark-800 p-4 rounded-lg border border-dark-600 mb-4">
          <code className="text-sm text-gray-300">
            address, postcode, price, saleDate, propertyType, tenure, bedrooms, bathrooms, squareFeet, description, location, town, district, county
          </code>
        </div>
        <p className="text-gray-400 text-sm">
          Note: Only address, postcode, price, saleDate, propertyType, and tenure are required. Other fields are optional.
        </p>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-200 mb-2 text-sm font-medium">Upload CSV File</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-500 file:text-white hover:file:bg-primary-600 cursor-pointer bg-dark-800 rounded-lg border border-dark-600 p-2"
        />
      </div>
      
      {showPreview && previewData.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-3">Preview (First 5 Records)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-dark-800 border border-dark-600 rounded-lg">
              <thead>
                <tr>
                  {previewData.length > 0 && previewData[0] ?
                    Object.keys(previewData[0]).map((key) => (
                      <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">
                        {key}
                      </th>
                    )) : null}
                </tr>
              </thead>
              <tbody>
                {previewData.map((property, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-dark-700' : 'bg-dark-800'}>
                    {Object.values(property).map((value, valueIndex) => (
                      <td key={valueIndex} className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Import Sold Properties'}
        </button>
        
        <button
          onClick={resetForm}
          disabled={isUploading}
          className="bg-dark-600 hover:bg-dark-500 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
      
      {isUploading && (
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-300">Uploading...</span>
            <span className="text-sm text-gray-300">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2.5">
            <div
              className="bg-red-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {uploadResults && (
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
          <h3 className="text-lg font-medium text-white mb-3">Upload Results</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-dark-700 p-3 rounded-lg">
              <p className="text-sm text-gray-300">Total</p>
              <p className="text-2xl font-bold text-white">{uploadResults.total}</p>
            </div>
            <div className="bg-green-900/30 p-3 rounded-lg">
              <p className="text-sm text-gray-300">Successful</p>
              <p className="text-2xl font-bold text-green-400">{uploadResults.successful}</p>
            </div>
            <div className="bg-red-900/30 p-3 rounded-lg">
              <p className="text-sm text-gray-300">Failed</p>
              <p className="text-2xl font-bold text-red-400">{uploadResults.failed}</p>
            </div>
          </div>
          
          {uploadResults.errors.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-white mb-2">Errors</h4>
              <div className="max-h-40 overflow-y-auto bg-dark-900 rounded-lg p-2">
                {uploadResults.errors.map((error, index) => (
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