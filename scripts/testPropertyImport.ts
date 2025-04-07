import fs from 'fs';
import path from 'path';
import { parseCSV, importSoldProperties } from '@/utils/propertyDataImport';
import logger from '@/utils/logger';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testPropertyImport() {
  const testLogger = logger.withContext('TestPropertyImport');
  testLogger.info('Starting property import test');

  try {
    // Read the sample CSV file
    const csvPath = path.join(process.cwd(), 'public', 'sample-sold-properties.csv');
    const csvData = fs.readFileSync(csvPath, 'utf8');
    
    testLogger.info('CSV file loaded successfully');
    
    // Parse the CSV data
    const properties = parseCSV(csvData);
    testLogger.info(`Parsed ${properties.length} properties from CSV`);
    
    // Import all properties
    testLogger.info(`Importing ${properties.length} properties...`);
    
    // Import the properties
    const results = await importSoldProperties(properties);
    
    // Log the results
    testLogger.info('Import completed with the following results:');
    testLogger.info(`Total: ${results.total}`);
    testLogger.info(`Successful: ${results.successful}`);
    testLogger.info(`Failed: ${results.failed}`);
    
    if (results.errors.length > 0) {
      testLogger.error('Errors encountered:');
      results.errors.forEach(error => {
        testLogger.error(`Property ${error.index}: ${error.error}`);
      });
    }
    
    testLogger.info('Test completed successfully');
  } catch (error) {
    testLogger.error('Error during property import test:', error);
  }
}

// Run the test
testPropertyImport().catch(console.error);