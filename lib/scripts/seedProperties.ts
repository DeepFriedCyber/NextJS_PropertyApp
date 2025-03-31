import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { getXataClient } from '@/lib/xata';
import { getEmbedding } from '@/lib/embedding';
import type { XataClient } from '@/lib/xata';

// Load environment variables
dotenv.config();

const propertyTypes = ['Flat', 'Terraced House', 'Detached', 'Cottage', 'Maisonette'];
const tenures = ['Freehold', 'Leasehold', 'Share of Freehold'];
const statuses = ['for-sale', 'for-rent', 'sold', 'let-agreed', 'under-offer'];

const getRandomImageUrl = () => {
  const width = 640;
  const height = 480;
  return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
};

const seed = async () => {
  const xata: XataClient = getXataClient();

  console.log('🌱 Starting to seed properties...');

  for (let i = 0; i < 10; i++) {
    const description = faker.lorem.paragraph();
    const prompt = `${faker.location.city()} ${description}`;
    
    try {
      // Try to get embedding, but don't let it block seeding if it fails
      let embedding;
      try {
        embedding = await getEmbedding(prompt);
      } catch (embedError) {
        console.warn(`⚠️ Embedding generation failed for property ${i + 1}, continuing without embedding`);
      }

      const property = await xata.db.properties.create({
        title: faker.company.name(),
        location: faker.location.city(),
        price: faker.number.int({ min: 200000, max: 1200000 }),
        imageUrl: getRandomImageUrl(),
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 3 }),
        squareFeet: faker.number.int({ min: 500, max: 2000 }),
        listingAgent: faker.person.fullName(),
        propertyType: faker.helpers.arrayElement(propertyTypes),
        tenure: faker.helpers.arrayElement(tenures),
        status: faker.helpers.arrayElement(statuses),
        description,
        ...(embedding ? { embedding } : {})
      });

      console.log(`✅ Created property ${i + 1}:`, {
        id: property.id,
        title: property.title,
        location: property.location
      });
    } catch (error) {
      console.error(`❌ Failed to create property ${i + 1}:`, error);
    }
  }

  console.log('🏠 Seeding complete!');
};

// Add XATA_BRANCH environment variable if not set
if (!process.env.XATA_BRANCH) {
  process.env.XATA_BRANCH = 'main';
}

seed().catch(console.error);
