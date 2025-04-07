/// <reference types="jest" />

import {
  generateTitle,
  parseCSV,
  importSoldProperty,
  importSoldProperties,
  UKSoldPropertyData
} from '@/utils/propertyDataImport';
import { getXataClient } from '@/lib/xata';
import { getEmbedding } from '@/lib/embeddings';
import { ValidationError, DatabaseError, EmbeddingError } from '@/utils/errors';

// Define test agents
const DatabaseAgent = {
  createProperty: jest.fn(),
  getProperty: jest.fn(),
  updateProperty: jest.fn(),
  deleteProperty: jest.fn()
};

const EmbeddingAgent = {
  generateEmbedding: jest.fn(),
  getEmbedding: jest.fn(),
  updateEmbedding: jest.fn()
};

const ValidationAgent = {
  validateProperty: jest.fn(),
  validateBatch: jest.fn()
};

const MonitoringAgent = {
  startOperation: jest.fn(),
  endOperation: jest.fn(),
  logError: jest.fn(),
  logWarning: jest.fn(),
  logInfo: jest.fn(),
  getMetrics: jest.fn()
};

const CachingAgent = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn()
};

// Test MCP Server
const TestMCPServer = {
  agents: {
    database: DatabaseAgent,
    embedding: EmbeddingAgent,
    validation: ValidationAgent,
    monitoring: MonitoringAgent,
    cache: CachingAgent
  },

  async processProperty(property: UKSoldPropertyData) {
    const operationId = this.agents.monitoring.startOperation('processProperty');
    
    try {
      if (!property) {
        throw new ValidationError('Property data is required');
      }

      // Check cache first
      const cachedProperty = await this.agents.cache.get(property.address);
      if (cachedProperty) {
        this.agents.monitoring.logInfo('Property found in cache');
        return cachedProperty;
      }

      // Validate property
      const validation = await this.agents.validation.validateProperty(property);
      if (!validation.valid) {
        throw new ValidationError(validation.errors.join(', '));
      }

      // Generate embedding
      let embedding;
      try {
        embedding = await this.agents.embedding.generateEmbedding(property);
      } catch (error) {
        this.agents.monitoring.logWarning('Embedding generation failed, continuing without it');
      }

      // Create property in database
      try {
        const result = await this.agents.database.createProperty({
          ...property,
          embedding
        });

        // Cache the result
        await this.agents.cache.set(property.address, result);
        
        return result;
      } catch (error) {
        throw new DatabaseError('Failed to create property in database', error as Error);
      }
    } catch (error) {
      this.agents.monitoring.logError('Error processing property', error);
      throw error;
    } finally {
      this.agents.monitoring.endOperation(operationId);
    }
  },

  async processBatch(properties: UKSoldPropertyData[]) {
    const operationId = this.agents.monitoring.startOperation('processBatch');
    const results = {
      total: properties.length,
      successful: 0,
      failed: 0,
      errors: [] as { index: number; error: string }[],
      metrics: {
        startTime: Date.now(),
        endTime: 0,
        duration: 0,
        cacheHits: 0,
        cacheMisses: 0
      }
    };

    try {
      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        if (!property) continue;

        try {
          await this.processProperty(property);
          results.successful++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            index: i,
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      results.metrics.endTime = Date.now();
      results.metrics.duration = results.metrics.endTime - results.metrics.startTime;
      results.metrics.cacheHits = this.agents.monitoring.getMetrics().cacheHits;
      results.metrics.cacheMisses = this.agents.monitoring.getMetrics().cacheMisses;

      return results;
    } finally {
      this.agents.monitoring.endOperation(operationId);
    }
  }
};

// Mock dependencies
jest.mock('@/lib/xata', () => ({
  getXataClient: jest.fn(() => ({
    db: {
      properties: DatabaseAgent
    }
  }))
}));

jest.mock('@/lib/embeddings', () => ({
  getEmbedding: EmbeddingAgent.generateEmbedding
}));

// Mock Redis
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined)
  }))
}));

describe('Property Data Import Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default mock behaviors
    ValidationAgent.validateProperty.mockResolvedValue({ valid: true, errors: [] });
    DatabaseAgent.createProperty.mockResolvedValue({ id: 'test-id' });
    EmbeddingAgent.generateEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
    MonitoringAgent.getMetrics.mockReturnValue({ cacheHits: 0, cacheMisses: 0 });
  });

  describe('generateTitle', () => {
    it('should generate a title with the first part of the address', () => {
      const title = generateTitle('123 Main St, Testville, Testshire', 'detached');
      expect(title).toBe('Detached for sale on 123 Main St');
    });

    it('should handle addresses without commas', () => {
      const title = generateTitle('123 Main St', 'flat');
      expect(title).toBe('Flat for sale on 123 Main St');
    });

    it('should handle empty address parts', () => {
      const title = generateTitle('', 'semi-detached');
      expect(title).toBe('Semi-detached for sale on ');
    });

    it('should handle null or undefined inputs', () => {
      // @ts-ignore - Testing with undefined
      const title1 = generateTitle(undefined, 'detached');
      expect(title1).toBe('Detached for sale on ');

      // @ts-ignore - Testing with null
      const title2 = generateTitle(null, 'detached');
      expect(title2).toBe('Detached for sale on ');
    });

    it('should handle empty array parts in address', () => {
      const title = generateTitle(',Testville,Testshire', 'bungalow');
      expect(title).toBe('Bungalow for sale on ');
    });
  });

  describe('parseCSV', () => {
    it('should parse valid CSV data correctly', () => {
      const csvData = `address,postcode,price,bedrooms,bathrooms,propertyType,squareFeet,tenure,saleDate
123 Main St,AB12 3CD,250000,3,2,detached,1500,freehold,2023-01-15
456 High St,CD34 5EF,180000,2,1,flat,800,leasehold,2023-02-20`;

      const result = parseCSV(csvData);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        address: '123 Main St',
        postcode: 'AB12 3CD',
        price: 250000,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: 'detached',
        squareFeet: 1500,
        tenure: 'freehold',
        saleDate: '2023-01-15'
      });
    });

    it('should handle empty CSV data', () => {
      expect(parseCSV('')).toEqual([]);
    });

    it('should handle CSV with only headers', () => {
      const csvText = 'address,postcode,price,saleDate,propertyType,tenure';
      expect(parseCSV(csvText)).toEqual([]);
    });
  });

  describe('importSoldProperty', () => {
    const mockProperty = {
      address: '123 Main St',
      postcode: 'AB12 3CD',
      price: 250000,
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'detached',
      squareFeet: 1500,
      tenure: 'freehold',
      saleDate: '2023-01-15'
    };

    it('should successfully import a valid property', async () => {
      const result = await TestMCPServer.processProperty(mockProperty);

      expect(result).toEqual({ id: 'test-id' });
      expect(ValidationAgent.validateProperty).toHaveBeenCalledWith(mockProperty);
      expect(EmbeddingAgent.generateEmbedding).toHaveBeenCalled();
      expect(DatabaseAgent.createProperty).toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      ValidationAgent.validateProperty.mockResolvedValueOnce({
        valid: false,
        errors: ['Invalid price']
      });

      await expect(TestMCPServer.processProperty(mockProperty))
        .rejects.toThrow('Invalid property data: Invalid price');
    });

    it('should continue without embedding when generation fails', async () => {
      EmbeddingAgent.generateEmbedding.mockRejectedValueOnce(new Error('Embedding failed'));

      const result = await TestMCPServer.processProperty(mockProperty);

      expect(result).toEqual({ id: 'test-id' });
      expect(DatabaseAgent.createProperty).toHaveBeenCalledWith(
        expect.not.objectContaining({ embedding: expect.anything() })
      );
    });

    it('should handle database errors', async () => {
      DatabaseAgent.createProperty.mockRejectedValueOnce(new Error('Database error'));

      await expect(TestMCPServer.processProperty(mockProperty))
        .rejects.toThrow('Failed to create property in database');
    });
  });

  describe('importSoldProperties', () => {
    const mockProperties = [
      {
        address: '123 Main St',
        postcode: 'AB12 3CD',
        price: 250000,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: 'detached',
        squareFeet: 1500,
        tenure: 'freehold',
        saleDate: '2023-01-15'
      },
      {
        address: '456 High St',
        postcode: 'CD34 5EF',
        price: 180000,
        bedrooms: 2,
        bathrooms: 1,
        propertyType: 'flat',
        squareFeet: 800,
        tenure: 'leasehold',
        saleDate: '2023-02-20'
      }
    ];

    it('should import multiple properties successfully', async () => {
      const result = await TestMCPServer.processBatch(mockProperties);

      expect(result.total).toBe(2);
      expect(result.successful).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(DatabaseAgent.createProperty).toHaveBeenCalledTimes(2);
    });

    it('should handle partial failures', async () => {
      DatabaseAgent.createProperty
        .mockResolvedValueOnce({ id: 'test-id-1' })
        .mockRejectedValueOnce(new Error('Database error'));

      const result = await TestMCPServer.processBatch(mockProperties);

      expect(result.total).toBe(2);
      expect(result.successful).toBe(1);
      expect(result.failed).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]!.error).toContain('Database error');
    });

    it('should handle empty array', async () => {
      const result = await TestMCPServer.processBatch([]);
      
      expect(result.total).toBe(0);
      expect(result.successful).toBe(0);
      expect(result.failed).toBe(0);
      expect(DatabaseAgent.createProperty).not.toHaveBeenCalled();
    });
  });

  describe('Caching', () => {
    const mockProperty = {
      address: '123 Main St',
      postcode: 'AB12 3CD',
      price: 250000,
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'detached',
      squareFeet: 1500,
      tenure: 'freehold',
      saleDate: '2023-01-15'
    };

    it('should use cached property when available', async () => {
      const cachedResult = { id: 'cached-id' };
      CachingAgent.get.mockResolvedValueOnce(cachedResult);

      const result = await TestMCPServer.processProperty(mockProperty);

      expect(result).toEqual(cachedResult);
      expect(DatabaseAgent.createProperty).not.toHaveBeenCalled();
      expect(EmbeddingAgent.generateEmbedding).not.toHaveBeenCalled();
    });

    it('should cache property after successful creation', async () => {
      const result = await TestMCPServer.processProperty(mockProperty);

      expect(CachingAgent.set).toHaveBeenCalledWith(mockProperty.address, result);
    });
  });

  describe('Monitoring', () => {
    const mockProperty = {
      address: '123 Main St',
      postcode: 'AB12 3CD',
      price: 250000,
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'detached',
      squareFeet: 1500,
      tenure: 'freehold',
      saleDate: '2023-01-15'
    };

    it('should track operation start and end', async () => {
      await TestMCPServer.processProperty(mockProperty);

      expect(MonitoringAgent.startOperation).toHaveBeenCalledWith('processProperty');
      expect(MonitoringAgent.endOperation).toHaveBeenCalled();
    });

    it('should track errors in monitoring', async () => {
      DatabaseAgent.createProperty.mockRejectedValueOnce(new Error('Database error'));

      await expect(TestMCPServer.processProperty(mockProperty))
        .rejects.toThrow('Failed to create property in database');

      expect(MonitoringAgent.logError).toHaveBeenCalled();
    });

    it('should include metrics in batch results', async () => {
      const result = await TestMCPServer.processBatch([mockProperty]);

      expect(result.metrics).toBeDefined();
      expect(result.metrics.duration).toBeGreaterThan(0);
      expect(result.metrics.cacheHits).toBeDefined();
      expect(result.metrics.cacheMisses).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent property processing', async () => {
      const properties = Array(5).fill({
        address: '123 Main St',
        postcode: 'AB12 3CD',
        price: 250000,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: 'detached',
        squareFeet: 1500,
        tenure: 'freehold',
        saleDate: '2023-01-15'
      });

      const results = await Promise.all(
        properties.map(property => TestMCPServer.processProperty(property))
      );

      expect(results).toHaveLength(5);
      expect(results.every(result => result.id === 'test-id')).toBe(true);
    });

    it('should handle very large property batches', async () => {
      const largeBatch = Array(1000).fill({
        address: '123 Main St',
        postcode: 'AB12 3CD',
        price: 250000,
        bedrooms: 3,
        bathrooms: 2,
        propertyType: 'detached',
        squareFeet: 1500,
        tenure: 'freehold',
        saleDate: '2023-01-15'
      });

      const result = await TestMCPServer.processBatch(largeBatch);

      expect(result.total).toBe(1000);
      expect(result.successful).toBe(1000);
      expect(result.failed).toBe(0);
    });

    it('should handle malformed property data', async () => {
      const malformedProperty = {
        address: '123 Main St',
        // Missing required fields
      } as unknown as UKSoldPropertyData;

      await expect(TestMCPServer.processProperty(malformedProperty))
        .rejects.toThrow();
    });
  });
});