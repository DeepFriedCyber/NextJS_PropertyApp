import { PropertyRepository } from '../repositories/property.repository';
import { createLogger } from '../utils/logger';

const logger = createLogger();

interface GetPropertiesOptions {
  page: number;
  limit: number;
  status?: string;
}

export class PropertyService {
  private propertyRepository: PropertyRepository;

  constructor() {
    this.propertyRepository = new PropertyRepository();
  }

  async getProperties(options: GetPropertiesOptions) {
    try {
      const { page, limit, status } = options;
      const offset = (page - 1) * limit;
      
      const properties = await this.propertyRepository.find({
        where: status ? { status } : undefined,
        skip: offset,
        take: limit
      });

      const total = await this.propertyRepository.count({
        where: status ? { status } : undefined
      });

      return {
        properties,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error in getProperties:', error);
      throw error;
    }
  }

  async getPropertyById(id: string) {
    try {
      return await this.propertyRepository.findOne({ where: { id } });
    } catch (error) {
      logger.error('Error in getPropertyById:', error);
      throw error;
    }
  }

  async searchProperties(query: string, filters: Record<string, any>) {
    try {
      return await this.propertyRepository.search(query, filters);
    } catch (error) {
      logger.error('Error in searchProperties:', error);
      throw error;
    }
  }
} 