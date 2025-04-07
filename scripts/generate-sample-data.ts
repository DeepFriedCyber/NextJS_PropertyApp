import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface Location {
  city: string;
  districts: string[];
}

// Sample data generators
const locations: Location[] = [
  { city: 'London', districts: ['Camden', 'Islington', 'Hackney', 'Greenwich', 'Lambeth', 'Southwark', 'Wandsworth', 'Hammersmith', 'Kensington', 'Westminster'] },
  { city: 'Manchester', districts: ['City Centre', 'Salford', 'Didsbury', 'Chorlton', 'Altrincham', 'Stockport', 'Trafford', 'Bury', 'Rochdale', 'Oldham'] },
  { city: 'Birmingham', districts: ['City Centre', 'Edgbaston', 'Moseley', 'Harborne', 'Solihull', 'Sutton Coldfield', 'Erdington', 'Kings Heath', 'Bournville', 'Hockley'] },
  { city: 'Leeds', districts: ['City Centre', 'Headingley', 'Chapel Allerton', 'Roundhay', 'Horsforth', 'Garforth', 'Morley', 'Pudsey', 'Otley', 'Wetherby'] },
  { city: 'Bristol', districts: ['Clifton', 'Redland', 'Southville', 'Bedminster', 'Stokes Croft', 'Montpelier', 'Bishopston', 'Westbury', 'Henleaze', 'Stoke Bishop'] }
];

const propertyTypes = ['Terraced', 'Semi-Detached', 'Detached', 'Apartment', 'Bungalow', 'Mews', 'Townhouse'] as const;
const tenureTypes = ['Freehold', 'Leasehold'] as const;
const propertyAges = ['New Build', 'Existing building', 'Period property'] as const;

type PropertyType = typeof propertyTypes[number];
type TenureType = typeof tenureTypes[number];
type PropertyAge = typeof propertyAges[number];

const postcodePrefixes: Record<string, string[]> = {
  'London': ['NW', 'SE', 'SW', 'W', 'E', 'N', 'EC', 'WC'],
  'Manchester': ['M'],
  'Birmingham': ['B'],
  'Leeds': ['LS'],
  'Bristol': ['BS']
};

const basePrices: Record<string, number> = {
  'London': 500000,
  'Manchester': 250000,
  'Birmingham': 220000,
  'Leeds': 200000,
  'Bristol': 300000
};

const typeMultipliers: Record<PropertyType, number> = {
  'Terraced': 1,
  'Semi-Detached': 1.2,
  'Detached': 1.5,
  'Apartment': 0.8,
  'Bungalow': 1.3,
  'Mews': 1.1,
  'Townhouse': 1.4
};

function generatePostcode(city: string): string {
  const prefixes = postcodePrefixes[city];
  if (!prefixes) throw new Error(`No postcode prefixes defined for city: ${city}`);
  
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix}${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
}

function generatePrice(city: string, propertyType: PropertyType): number {
  const basePrice = basePrices[city];
  const multiplier = typeMultipliers[propertyType];
  
  if (basePrice === undefined) throw new Error(`No base price defined for city: ${city}`);
  if (multiplier === undefined) throw new Error(`No multiplier defined for property type: ${propertyType}`);
  
  const variation = 0.2; // ±20% variation
  return Math.round(basePrice * multiplier * (1 + (Math.random() * variation * 2 - variation)));
}

function generateBedrooms(propertyType: PropertyType): number {
  if (propertyType === 'Apartment') {
    return Math.floor(Math.random() * 3) + 1; // 1-3 bedrooms
  }
  return Math.floor(Math.random() * 4) + 2; // 2-5 bedrooms
}

function generateBathrooms(bedrooms: number): number {
  return Math.min(Math.floor(Math.random() * 3) + 1, bedrooms); // 1-3 bathrooms, but not more than bedrooms
}

function generateSaleDate(): string {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0]!;
}

interface Property {
  title: string;
  description: string;
  price: number;
  location: string;
  postcode: string;
  bedrooms: number;
  bathrooms: number;
  property_type: PropertyType;
  status: string;
  image_url: string;
  land_registry_id: string;
  sale_date: string;
  tenure_type: TenureType;
  property_age: PropertyAge;
  street_name: string;
  town_city: string;
  district: string;
  county: string;
}

async function generateSampleData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Generating sample data...');
    
    const properties: Property[] = [];
    for (let i = 0; i < 100; i++) {
      const location = locations[Math.floor(Math.random() * locations.length)];
      if (!location) throw new Error('No location selected');
      
      const district = location.districts[Math.floor(Math.random() * location.districts.length)];
      if (!district) throw new Error('No district selected');
      
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      if (!propertyType) throw new Error('No property type selected');
      
      const price = generatePrice(location.city, propertyType);
      const bedrooms = generateBedrooms(propertyType);
      const bathrooms = generateBathrooms(bedrooms);
      const postcode = generatePostcode(location.city);
      const saleDate = generateSaleDate();
      const tenureType = tenureTypes[Math.floor(Math.random() * tenureTypes.length)];
      if (!tenureType) throw new Error('No tenure type selected');
      
      const propertyAge = propertyAges[Math.floor(Math.random() * propertyAges.length)];
      if (!propertyAge) throw new Error('No property age selected');

      properties.push({
        title: `${propertyType} in ${district}`,
        description: `Beautiful ${propertyAge.toLowerCase()} ${propertyType.toLowerCase()} in the heart of ${district}`,
        price,
        location: `${district}, ${location.city}`,
        postcode,
        bedrooms,
        bathrooms,
        property_type: propertyType,
        status: 'Sold',
        image_url: `https://example.com/property-${i + 1}.jpg`,
        land_registry_id: `LR${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        sale_date: saleDate,
        tenure_type: tenureType,
        property_age: propertyAge,
        street_name: `${district} ${propertyType === 'Apartment' ? 'Avenue' : 'Road'}`,
        town_city: location.city,
        district,
        county: location.city === 'London' ? 'Greater London' : `${location.city}shire`
      });
    }

    // Insert the data
    const values = properties.map((p, i) => 
      `($${i * 18 + 1}, $${i * 18 + 2}, $${i * 18 + 3}, $${i * 18 + 4}, $${i * 18 + 5}, $${i * 18 + 6}, $${i * 18 + 7}, $${i * 18 + 8}, $${i * 18 + 9}, $${i * 18 + 10}, $${i * 18 + 11}, $${i * 18 + 12}, $${i * 18 + 13}, $${i * 18 + 14}, $${i * 18 + 15}, $${i * 18 + 16}, $${i * 18 + 17}, $${i * 18 + 18})`
    ).join(',');

    const query = `
      INSERT INTO properties (
        title, description, price, location, postcode, bedrooms, bathrooms,
        property_type, status, image_url, land_registry_id, sale_date,
        tenure_type, property_age, street_name, town_city, district, county
      ) VALUES ${values}
    `;

    const params = properties.flatMap(p => [
      p.title, p.description, p.price, p.location, p.postcode, p.bedrooms, p.bathrooms,
      p.property_type, p.status, p.image_url, p.land_registry_id, p.sale_date,
      p.tenure_type, p.property_age, p.street_name, p.town_city, p.district, p.county
    ]);

    await pool.query(query, params);
    console.log('Sample data generated and inserted successfully!');

  } catch (error) {
    console.error('Error generating sample data:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

generateSampleData().catch(console.error); 