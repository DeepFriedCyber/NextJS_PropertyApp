import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Setting up database schema...');
    
    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../server/src/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('Database schema created successfully!');

    // Insert some sample data with Land Registry style information
    const sampleData = `
      INSERT INTO properties (
        title, description, price, location, postcode, bedrooms, bathrooms,
        property_type, status, image_url, land_registry_id, sale_date,
        tenure_type, property_age, street_name, town_city, district, county
      )
      VALUES 
        (
          'Victorian Terrace in Camden',
          'Beautiful Victorian terrace with period features and modern amenities',
          875000.00,
          'Camden, London',
          'NW1 8NH',
          3,
          2,
          'Terraced',
          'Sold',
          'https://example.com/camden-house.jpg',
          'LR123456789',
          '2023-11-15',
          'Freehold',
          'Existing building',
          'Camden High Street',
          'London',
          'Camden',
          'Greater London'
        ),
        (
          'Modern Apartment in Manchester City Centre',
          'Stunning city centre apartment with panoramic views',
          350000.00,
          'Manchester City Centre',
          'M1 4BT',
          2,
          2,
          'Apartment',
          'Sold',
          'https://example.com/manchester-apt.jpg',
          'LR987654321',
          '2023-12-01',
          'Leasehold',
          'New Build',
          'Deansgate',
          'Manchester',
          'City Centre',
          'Greater Manchester'
        ),
        (
          'Detached House in Birmingham Suburbs',
          'Spacious family home with large garden and off-street parking',
          425000.00,
          'Edgbaston, Birmingham',
          'B15 3DP',
          4,
          3,
          'Detached',
          'Sold',
          'https://example.com/birmingham-house.jpg',
          'LR456789123',
          '2024-01-10',
          'Freehold',
          'Existing building',
          'Wellington Road',
          'Birmingham',
          'Edgbaston',
          'West Midlands'
        )
      ON CONFLICT DO NOTHING;
    `;

    await pool.query(sampleData);
    console.log('Sample data inserted successfully!');

  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

setupDatabase().catch(console.error); 