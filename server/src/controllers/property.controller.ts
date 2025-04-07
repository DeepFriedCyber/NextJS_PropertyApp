import { Request, Response } from 'express';
import { PropertyService } from '../services/property.service';
import { createLogger } from '../utils/logger';

const logger = createLogger();

export class PropertyController {
  private propertyService: PropertyService;

  constructor() {
    this.propertyService = new PropertyService();
  }

  getProperties = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const properties = await this.propertyService.getProperties({
        page: Number(page),
        limit: Number(limit),
        status: status as string
      });
      res.json(properties);
    } catch (error) {
      logger.error('Error fetching properties:', error);
      res.status(500).json({ error: 'Failed to fetch properties' });
    }
  };

  getPropertyById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const property = await this.propertyService.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
      res.json(property);
    } catch (error) {
      logger.error('Error fetching property:', error);
      res.status(500).json({ error: 'Failed to fetch property' });
    }
  };

  searchProperties = async (req: Request, res: Response) => {
    try {
      const { query, filters } = req.query;
      const properties = await this.propertyService.searchProperties(
        query as string,
        filters as Record<string, any>
      );
      res.json(properties);
    } catch (error) {
      logger.error('Error searching properties:', error);
      res.status(500).json({ error: 'Failed to search properties' });
    }
  };
} 