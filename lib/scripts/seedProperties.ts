import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { getXataClient } from '@/lib/xata';
import { getEmbedding } from '@/lib/embedding';
import type { XataClient } from '@/lib/xata';

// Load environment variables
dotenv.config();

// Use UK-specific data
// Note: faker.js v8 doesn't have setLocale for location module
// We'll use UK-specific data manually

// UK-specific property types
const propertyTypes = [
  'Detached',
  'Semi-Detached',
  'Terraced House',
  'End of Terrace',
  'Flat',
  'Apartment',
  'Maisonette',
  'Cottage',
  'Bungalow',
  'Townhouse',
  'New Build'
];

// UK-specific tenures
const tenures = ['Freehold', 'Leasehold', 'Share of Freehold', 'Commonhold'];

// UK-specific property statuses
const statuses = ['for-sale', 'to-let', 'sold', 'let-agreed', 'under-offer', 'sold-stc'];

// UK cities and towns
const ukLocations = [
  'London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow',
  'Liverpool', 'Bristol', 'Leeds', 'Sheffield', 'Cardiff',
  'Belfast', 'Newcastle', 'Oxford', 'Cambridge', 'York',
  'Bath', 'Brighton', 'Nottingham', 'Southampton', 'Plymouth',
  'Aberdeen', 'Exeter', 'Leicester', 'Coventry', 'Reading'
];

// UK postcodes by area
const ukPostcodes = {
  'London': ['SW1', 'SW3', 'SW7', 'NW1', 'NW3', 'W1', 'W8', 'E1', 'E14', 'SE1'],
  'Manchester': ['M1', 'M2', 'M3', 'M4', 'M14', 'M20', 'M21', 'M22', 'M23', 'M25'],
  'Birmingham': ['B1', 'B2', 'B3', 'B4', 'B5', 'B15', 'B16', 'B29', 'B30', 'B31'],
  'Edinburgh': ['EH1', 'EH2', 'EH3', 'EH4', 'EH10', 'EH11', 'EH12', 'EH13', 'EH14', 'EH16'],
  'Glasgow': ['G1', 'G2', 'G3', 'G4', 'G11', 'G12', 'G13', 'G14', 'G20', 'G21'],
  'Liverpool': ['L1', 'L2', 'L3', 'L4', 'L5', 'L17', 'L18', 'L19', 'L24', 'L25'],
  'Bristol': ['BS1', 'BS2', 'BS3', 'BS4', 'BS5', 'BS6', 'BS7', 'BS8', 'BS9', 'BS10'],
  'Leeds': ['LS1', 'LS2', 'LS3', 'LS4', 'LS5', 'LS6', 'LS7', 'LS8', 'LS16', 'LS17'],
  'Sheffield': ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S10', 'S11'],
  'Cardiff': ['CF10', 'CF11', 'CF14', 'CF15', 'CF23', 'CF24', 'CF3', 'CF5', 'CF72', 'CF91'],
  'Belfast': ['BT1', 'BT2', 'BT3', 'BT4', 'BT5', 'BT6', 'BT7', 'BT8', 'BT9', 'BT11'],
  'Newcastle': ['NE1', 'NE2', 'NE3', 'NE4', 'NE5', 'NE6', 'NE7', 'NE8', 'NE12', 'NE13'],
  'Oxford': ['OX1', 'OX2', 'OX3', 'OX4', 'OX5', 'OX33', 'OX44', 'OX49'],
  'Cambridge': ['CB1', 'CB2', 'CB3', 'CB4', 'CB5', 'CB22', 'CB23', 'CB24'],
  'York': ['YO1', 'YO10', 'YO23', 'YO24', 'YO26', 'YO30', 'YO31', 'YO32'],
  'Bath': ['BA1', 'BA2', 'BA3'],
  'Brighton': ['BN1', 'BN2', 'BN3', 'BN41', 'BN42', 'BN43'],
  'Nottingham': ['NG1', 'NG2', 'NG3', 'NG4', 'NG5', 'NG6', 'NG7', 'NG8'],
  'Southampton': ['SO14', 'SO15', 'SO16', 'SO17', 'SO18', 'SO19', 'SO30', 'SO31'],
  'Plymouth': ['PL1', 'PL2', 'PL3', 'PL4', 'PL5', 'PL6', 'PL7', 'PL8', 'PL9'],
  'Aberdeen': ['AB10', 'AB11', 'AB12', 'AB15', 'AB16', 'AB21', 'AB22', 'AB24', 'AB25'],
  'Exeter': ['EX1', 'EX2', 'EX3', 'EX4', 'EX5'],
  'Leicester': ['LE1', 'LE2', 'LE3', 'LE4', 'LE5', 'LE7', 'LE8', 'LE9'],
  'Coventry': ['CV1', 'CV2', 'CV3', 'CV4', 'CV5', 'CV6', 'CV7', 'CV8'],
  'Reading': ['RG1', 'RG2', 'RG4', 'RG5', 'RG6', 'RG30', 'RG31']
};

// UK estate agents
const estateAgents = [
  'Savills', 'Knight Frank', 'Foxtons', 'Purplebricks', 'Hamptons',
  'Winkworth', 'Chancellors', 'Connells', 'Countrywide', 'Dexters',
  'Haart', 'Your Move', 'Reeds Rains', 'Hunters', 'Marsh & Parsons',
  'Strutt & Parker', 'Chestertons', 'Barnard Marcus', 'Bairstow Eves', 'Bridgfords'
];

// Property features
const propertyFeatures = [
  'Garden', 'Garage', 'Parking', 'Balcony', 'Terrace',
  'Conservatory', 'Utility Room', 'En Suite', 'Double Glazing', 'Central Heating',
  'Fireplace', 'Loft Conversion', 'Basement', 'Swimming Pool', 'Gym',
  'Home Office', 'Underfloor Heating', 'Smart Home System', 'Solar Panels', 'EV Charging Point'
];

// Generate realistic UK property titles
const generatePropertyTitle = (propertyType: string, bedrooms: number, location: string): string => {
  const adjectives = [
    'Charming', 'Stunning', 'Beautiful', 'Elegant', 'Spacious',
    'Luxurious', 'Modern', 'Contemporary', 'Traditional', 'Characterful',
    'Immaculate', 'Stylish', 'Impressive', 'Delightful', 'Exceptional'
  ];

  const adjective = faker.helpers.arrayElement(adjectives);

  if (propertyType === 'Flat' || propertyType === 'Apartment' || propertyType === 'Maisonette') {
    return `${adjective} ${bedrooms} Bedroom ${propertyType} in ${location}`;
  } else {
    return `${adjective} ${bedrooms} Bedroom ${propertyType} House in ${location}`;
  }
};

// Generate realistic UK property descriptions
const generatePropertyDescription = (
  propertyType: string,
  bedrooms: number,
  bathrooms: number,
  location: string,
  features: string[]
): string => {
  const intro = [
    `We are delighted to offer this ${propertyType.toLowerCase()} to the market.`,
    `A rare opportunity to acquire this ${propertyType.toLowerCase()} in a sought-after location.`,
    `This impressive ${propertyType.toLowerCase()} offers spacious accommodation throughout.`,
    `An exceptional ${propertyType.toLowerCase()} situated in a prime ${location} location.`,
    `A superb example of a ${propertyType.toLowerCase()} offering versatile living space.`
  ];

  const accommodation = [
    `The property comprises ${bedrooms} bedrooms, ${bathrooms} bathrooms, a reception room, and a fitted kitchen.`,
    `Accommodation includes ${bedrooms} bedrooms, ${bathrooms} bathrooms, a spacious living area, and a modern kitchen.`,
    `The property features ${bedrooms} bedrooms, ${bathrooms} bathrooms, a lounge, and a fully equipped kitchen.`,
    `Inside you'll find ${bedrooms} bedrooms, ${bathrooms} bathrooms, a reception room, and a contemporary kitchen.`,
    `The accommodation offers ${bedrooms} bedrooms, ${bathrooms} bathrooms, a living room, and a stylish kitchen.`
  ];

  const featuresText = features.length > 0
    ? `Additional features include ${features.join(', ')}.`
    : '';

  const location_text = [
    `Conveniently located for local amenities and transport links.`,
    `Within easy reach of shops, restaurants, and public transport.`,
    `Close to excellent schools, parks, and leisure facilities.`,
    `Ideally situated for commuters with nearby transport connections.`,
    `In a popular residential area with good local amenities.`
  ];

  const viewing = [
    `Viewing is highly recommended to appreciate this property.`,
    `Early viewing is advised to avoid disappointment.`,
    `Contact us today to arrange a viewing.`,
    `This property must be viewed to be fully appreciated.`,
    `Don't miss this opportunity - call now to arrange a viewing.`
  ];

  return `${faker.helpers.arrayElement(intro)} ${faker.helpers.arrayElement(accommodation)} ${featuresText} ${faker.helpers.arrayElement(location_text)} ${faker.helpers.arrayElement(viewing)}`;
};

// Get random property images
const getRandomImageUrl = () => {
  const width = 640;
  const height = 480;
  return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
};

// Generate a random UK postcode
const getRandomPostcode = (location: string): string => {
  const postcodes = ukPostcodes[location as keyof typeof ukPostcodes] || ukPostcodes['London'];
  const postcode = faker.helpers.arrayElement(postcodes);
  return `${postcode} ${faker.number.int({ min: 1, max: 9 })}${faker.string.alpha({ casing: 'upper' })}${faker.string.alpha({ casing: 'upper' })}`;
};

// Generate a random price based on location and property type
const generatePrice = (location: string, propertyType: string, isForSale: boolean): number => {
  // Base prices by location (in GBP)
  const basePricesByLocation = {
    'London': { min: 500000, max: 2000000 },
    'Oxford': { min: 400000, max: 1500000 },
    'Cambridge': { min: 400000, max: 1500000 },
    'Edinburgh': { min: 300000, max: 1200000 },
    'Bristol': { min: 300000, max: 1000000 },
    'Manchester': { min: 250000, max: 800000 },
    'Birmingham': { min: 220000, max: 700000 },
    'Glasgow': { min: 200000, max: 600000 },
    'Leeds': { min: 200000, max: 600000 },
    'Liverpool': { min: 180000, max: 550000 },
    'default': { min: 200000, max: 700000 }
  };

  // Property type multipliers
  const propertyTypeMultipliers = {
    'Detached': 1.5,
    'Semi-Detached': 1.2,
    'Terraced House': 1.0,
    'End of Terrace': 1.1,
    'Townhouse': 1.3,
    'Bungalow': 1.2,
    'Cottage': 1.1,
    'Flat': 0.8,
    'Apartment': 0.9,
    'Maisonette': 0.85,
    'New Build': 1.4
  };

  // Get base price range for location
  const basePriceRange = basePricesByLocation[location as keyof typeof basePricesByLocation] || basePricesByLocation['default'];

  // Get multiplier for property type
  const multiplier = propertyTypeMultipliers[propertyType as keyof typeof propertyTypeMultipliers] || 1.0;

  // Calculate price range
  const minPrice = Math.round(basePriceRange.min * multiplier);
  const maxPrice = Math.round(basePriceRange.max * multiplier);

  // Generate price
  let price = faker.number.int({ min: minPrice, max: maxPrice });

  // Round to nearest 5000
  price = Math.round(price / 5000) * 5000;

  // If it's a rental, convert to monthly rent (roughly 0.3-0.4% of property value per month)
  if (!isForSale) {
    price = Math.round((price * faker.number.float({ min: 0.003, max: 0.004 })) / 50) * 50;
  }

  return price;
};

// Seed the database with UK properties
const seed = async () => {
  const xata: XataClient = getXataClient();

  console.log('🌱 Starting to seed UK properties...');

  // Clear existing properties if needed
  // Uncomment the following lines if you want to clear the database before seeding
  // console.log('🧹 Clearing existing properties...');
  // await xata.db.properties.delete();
  // console.log('✅ Existing properties cleared');

  // Number of properties to create
  const numberOfProperties = 20;

  for (let i = 0; i < numberOfProperties; i++) {
    // Generate property details
    const location = faker.helpers.arrayElement(ukLocations);
    const propertyType = faker.helpers.arrayElement(propertyTypes);
    const bedrooms = faker.number.int({ min: 1, max: 6 });
    const bathrooms = faker.number.int({ min: 1, max: bedrooms });
    const isForSale = faker.helpers.arrayElement([true, true, true, false]); // 75% for sale, 25% for rent
    const status = isForSale
      ? faker.helpers.arrayElement(['for-sale', 'sold', 'under-offer', 'sold-stc'])
      : faker.helpers.arrayElement(['to-let', 'let-agreed']);

    // Generate random features (2-5 features)
    const numFeatures = faker.number.int({ min: 2, max: 5 });
    const features = faker.helpers.arrayElements(propertyFeatures, numFeatures);

    // Generate title and description
    const title = generatePropertyTitle(propertyType, bedrooms, location);
    const description = generatePropertyDescription(propertyType, bedrooms, bathrooms, location, features);

    // Generate price based on location and property type
    const price = generatePrice(location, propertyType, isForSale);

    // Generate postcode
    const postcode = getRandomPostcode(location);

    // We don't need listedDate as the database will use xata_createdat

    // Generate agent
    const listingAgent = faker.helpers.arrayElement(estateAgents);

    // Generate square feet based on bedrooms
    const squareFeet = faker.number.int({ min: bedrooms * 300, max: bedrooms * 500 });

    // Generate prompt for embedding
    const prompt = `${title} ${location} ${description}`;

    try {
      // Try to get embedding, but don't let it block seeding if it fails
      let embedding;
      try {
        embedding = await getEmbedding(prompt);
      } catch (embedError) {
        console.warn(`⚠️ Embedding generation failed for property ${i + 1}, continuing without embedding`);
      }

      // Create property in database with fields that match the schema
      const property = await xata.db.properties.create({
        title,
        location,
        price,
        imageUrl: getRandomImageUrl(),
        bedrooms,
        bathrooms,
        squareFeet,
        listingAgent,
        propertyType,
        tenure: faker.helpers.arrayElement(tenures),
        status,
        description,
        features: features, // This should be an array for multiple type
        ...(embedding ? { embedding } : {})
      });

      console.log(`✅ Created property ${i + 1}:`, {
        id: property.id,
        title: property.title,
        location: property.location,
        price: `£${property.price?.toLocaleString() || '0'}${!isForSale ? ' pcm' : ''}`,
        status: property.status
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
