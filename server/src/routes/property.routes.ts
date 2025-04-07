import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller';

const router = Router();
const propertyController = new PropertyController();

// Get properties with pagination and filters
router.get('/', propertyController.getProperties);

// Get property by ID
router.get('/:id', propertyController.getPropertyById);

// Search properties
router.get('/search', propertyController.searchProperties);

export default router; 