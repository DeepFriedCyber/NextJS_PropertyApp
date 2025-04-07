import { getXataClient } from '../lib/xata';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const sampleProperties = [
  {
    title: 'Modern Apartment in Central London',
    description: 'A beautiful modern apartment located in the heart of London, perfect for young professionals.',
    price: 500000,
    location: 'London',
    bedrooms: 2,
    bathrooms: 1,
    status: 'For Sale',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24d8516a6d2'
  },
  {
    title: 'Victorian Terrace in Manchester',
    description: 'A charming Victorian terrace house with period features and modern amenities.',
    price: 300000,
    location: 'Manchester',
    bedrooms: 3,
    bathrooms: 2,
    status: 'For Sale',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
  }
];

async function populateDatabase() {
  const xata = getXataClient();

  try {
    console.log('Starting to populate database...');
    
    for (const property of sampleProperties) {
      await xata.db.properties.create(property);
      console.log(`Created property: ${property.title}`);
    }
    
    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  }
}

populateDatabase(); 