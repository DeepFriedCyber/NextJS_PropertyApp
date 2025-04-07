'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  processFileData, 
  importProperties, 
  FlexiblePropertyData, 
  FieldMapping,
  normalizePropertyData
} from '@/utils/flexiblePropertyImport';
import { PropertyType, TenureType, PropertyStatus } from '@/types/uk-property';

export default function FlexiblePropertyImport() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: { index: number; error: string }[];
  } | null>(null);
  
  const [rawData, setRawData] = useState<FlexiblePropertyData[]>([]);
  const [detectedMapping, setDetectedMapping] = useState<FieldMapping>({});
  const [customMapping, setCustomMapping] = useState<FieldMapping>({});
  const [normalizedData, setNormalizedData] = useState<FlexiblePropertyData[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'preview' | 'results'>('upload');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update normalized data when mapping changes
  useEffect(() => {
    if (rawData.length > 0 && (Object.keys(detectedMapping).length > 0 || Object.keys(customMapping).length > 0)) {
      const finalMapping = { ...detectedMapping, ...customMapping };
      const normalized = rawData.map(item => normalizePropertyData(item, finalMapping));
      setNormalizedData(normalized);
    }
  }, [rawData, detectedMapping, customMapping]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setUploadResults(null);
    setCurrentStep('upload');
    
    try {
      const { data, mapping } = await processFileData(selectedFile);
      setRawData(data);
      setDetectedMapping(mapping);
      setCustomMapping({});
      setCurrentStep('mapping');
    } catch (error) {
      console.error('Error processing file:', error);
      alert(`Error processing file: ${(error as Error).message}`);
    }
  };

  const handleMappingChange = (standardField: keyof FieldMapping, headerField: string) => {
    setCustomMapping(prev => ({
      ...prev,
      [standardField]: headerField
    }));
  };

  const proceedToPreview = () => {
    setCurrentStep('preview');
  };

  const handleUpload = async () => {
    if (normalizedData.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setCurrentStep('results');
    
    try {
      // Process in batches to show progress
      const batchSize = 10;
      const totalBatches = Math.ceil(normalizedData.length / batchSize);
      let processedCount = 0;
      let results = {
        total: normalizedData.length,
        successful: 0,
        failed: 0,
        errors: [] as { index: number; error: string }[]
      };
      
      for (let i = 0; i < normalizedData.length; i += batchSize) {
        const batch = normalizedData.slice(i, i + batchSize);
        const batchResults = await importProperties(batch);
        
        // Update results
        results.successful += batchResults.successful;
        results.failed += batchResults.failed;
        results.errors = [...results.errors, ...batchResults.errors.map((err: { index: number; error: string }) => ({
          index: i + err.index,
          error: err.error
        }))];
        
        // Update progress
        processedCount += batch.length;
        setUploadProgress(Math.round((processedCount / normalizedData.length) * 100));
      }
      
      setUploadResults(results);
    } catch (error) {
      console.error('Error uploading properties:', error);
      alert(`Error uploading properties: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setRawData([]);
    setDetectedMapping({});
    setCustomMapping({});
    setNormalizedData([]);
    setUploadResults(null);
    setCurrentStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render the file upload step
  const renderUploadStep = () => (
    <div className="mb-6">
      <div className="mb-6">
        <label className="block text-gray-200 mb-2 text-sm font-medium">Upload Property Data File</label>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-500 file:text-white hover:file:bg-primary-600 cursor-pointer bg-dark-800 rounded-lg border border-dark-600 p-2"
        />
        <p className="mt-2 text-sm text-gray-400">
          Supported formats: CSV, Excel (.xlsx, .xls)
        </p>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-8">
        <div className="bg-dark-800 p-4 rounded-lg border border-dark-600 flex-1 min-w-[250px]">
          <h3 className="text-lg font-medium text-white mb-3">CSV Example</h3>
          <p className="text-sm text-gray-300 mb-2">
            Your CSV file can have columns in any order with various header names.
          </p>
          <div className="bg-dark-900 p-3 rounded-lg overflow-x-auto text-xs">
            <code className="text-gray-300">
              Address,Price,Beds,Type,Status<br/>
              123 High St,350000,3,Detached,For Sale<br/>
              45 Park Ln,275000,2,Flat,Sold
            </code>
          </div>
        </div>
        
        <div className="bg-dark-800 p-4 rounded-lg border border-dark-600 flex-1 min-w-[250px]">
          <h3 className="text-lg font-medium text-white mb-3">Excel Example</h3>
          <p className="text-sm text-gray-300 mb-2">
            Your Excel file can use various column names - our system will try to match them.
          </p>
          <div className="bg-dark-900 p-3 rounded-lg overflow-x-auto text-xs">
            <code className="text-gray-300">
              Property | Location | Price | Bedrooms | Bathrooms<br/>
              Detached | London | 450000 | 4 | 2<br/>
              Flat | Manchester | 195000 | 2 | 1
            </code>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the field mapping step
  const renderMappingStep = () => {
    if (rawData.length === 0) return null;
    
    // Get all available headers from the first data item
    const availableHeaders = Object.keys(rawData[0] as object);
    
    // Standard fields we want to map
    const standardFields: Array<{key: keyof FieldMapping, label: string}> = [
      { key: 'title', label: 'Property Title' },
      { key: 'address', label: 'Address' },
      { key: 'postcode', label: 'Postcode' },
      { key: 'price', label: 'Price' },
      { key: 'description', label: 'Description' },
      { key: 'propertyType', label: 'Property Type' },
      { key: 'bedrooms', label: 'Bedrooms' },
      { key: 'bathrooms', label: 'Bathrooms' },
      { key: 'squareFeet', label: 'Square Feet' },
      { key: 'tenure', label: 'Tenure' },
      { key: 'status', label: 'Status' },
      { key: 'location', label: 'Location' },
      { key: 'features', label: 'Features' },
      { key: 'imageUrl', label: 'Image URL' },
      { key: 'listingAgent', label: 'Listing Agent' },
    ];
    
    return (
      <div className="mb-6">
        <h3 className="text-xl font-medium text-white mb-4">Map Your Data Fields</h3>
        <p className="text-gray-300 mb-4">
          We've automatically detected some field mappings. You can adjust them if needed.
        </p>
        
        <div className="bg-dark-800 p-4 rounded-lg border border-dark-600 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standardFields.map(field => {
              const mappedField = customMapping[field.key] || detectedMapping[field.key];
              const isRequired = ['address', 'price', 'propertyType'].includes(field.key);
              
              return (
                <div key={field.key} className="mb-4">
                  <label className="block text-gray-200 mb-2 text-sm font-medium">
                    {field.label}
                    {isRequired && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  <select
                    value={mappedField || ''}
                    onChange={(e) => handleMappingChange(field.key, e.target.value)}
                    className="w-full bg-dark-700 text-white rounded-lg p-2 border border-dark-600 focus:border-primary-400 focus:ring-primary-400"
                  >
                    <option value="">Not Mapped</option>
                    {availableHeaders.map(header => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                  {isRequired && !mappedField && (
                    <p className="text-red-400 text-xs mt-1">This field is required</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={resetForm}
            className="bg-dark-600 hover:bg-dark-500 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            Back
          </button>
          
          <button
            onClick={proceedToPreview}
            className="bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            disabled={!detectedMapping.address && !customMapping.address}
          >
            Preview Data
          </button>
        </div>
      </div>
    );
  };

  // Render the data preview step
  const renderPreviewStep = () => {
    if (normalizedData.length === 0) return null;
    
    // Show first 5 records for preview
    const previewData = normalizedData.slice(0, 5);
    
    return (
      <div className="mb-6">
        <h3 className="text-xl font-medium text-white mb-4">Preview Your Data</h3>
        <p className="text-gray-300 mb-4">
          Review how your data will be imported. We've processed and normalized your data based on your field mappings.
        </p>
        
        <div className="bg-dark-800 p-4 rounded-lg border border-dark-600 mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-dark-700 border border-dark-600 rounded-lg">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Title</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Address</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Price</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Beds</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-dark-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((property, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-dark-800' : 'bg-dark-700'}>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600">{property.title}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600">{property.address}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600">£{property.price?.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600">{property.propertyType}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600">{property.bedrooms}</td>
                    <td className="px-4 py-2 text-sm text-gray-300 border-b border-dark-600">{property.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-3 bg-dark-900 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="font-medium text-primary-300">Total records:</span> {normalizedData.length}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setCurrentStep('mapping')}
            className="bg-dark-600 hover:bg-dark-500 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            Back to Mapping
          </button>
          
          <button
            onClick={handleUpload}
            className="bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            Import Properties
          </button>
        </div>
      </div>
    );
  };

  // Render the results step
  const renderResultsStep = () => (
    <div className="mb-6">
      {isUploading && (
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-300">Uploading...</span>
            <span className="text-sm text-gray-300">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2.5">
            <div 
              className="bg-primary-500 h-2.5 rounded-full" 
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
          
          <div className="mt-6">
            <button
              onClick={resetForm}
              className="bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              Import More Properties
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-dark-700 rounded-xl shadow-xl p-6 border border-dark-600 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Flexible Property Import</h2>
      
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['upload', 'mapping', 'preview', 'results'].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === step 
                    ? 'bg-primary-500 text-white' 
                    : index < ['upload', 'mapping', 'preview', 'results'].indexOf(currentStep)
                      ? 'bg-primary-700 text-white'
                      : 'bg-dark-600 text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-xs mt-1 ${
                currentStep === step 
                  ? 'text-primary-300' 
                  : 'text-gray-400'
              }`}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 h-1 bg-dark-600 w-full rounded"></div>
          <div 
            className="absolute top-0 left-0 h-1 bg-primary-500 rounded transition-all duration-300"
            style={{ 
              width: `${
                currentStep === 'upload' ? '0%' : 
                currentStep === 'mapping' ? '33%' : 
                currentStep === 'preview' ? '66%' : '100%'
              }` 
            }}
          ></div>
        </div>
      </div>
      
      {/* Step content */}
      {currentStep === 'upload' && renderUploadStep()}
      {currentStep === 'mapping' && renderMappingStep()}
      {currentStep === 'preview' && renderPreviewStep()}
      {currentStep === 'results' && renderResultsStep()}
    </div>
  );
}