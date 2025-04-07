-- Drop existing table and related objects
DROP TABLE IF EXISTS properties CASCADE;

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2),
    location VARCHAR(255),
    postcode VARCHAR(10),
    bedrooms INTEGER,
    bathrooms INTEGER,
    property_type VARCHAR(50),
    status VARCHAR(50),
    image_url TEXT,
    land_registry_id VARCHAR(50),
    sale_date DATE,
    tenure_type VARCHAR(50),  -- Freehold, Leasehold, etc.
    property_age VARCHAR(50), -- New Build, Existing building
    street_name VARCHAR(255),
    town_city VARCHAR(100),
    district VARCHAR(100),
    county VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_postcode ON properties(postcode);
CREATE INDEX IF NOT EXISTS idx_properties_sale_date ON properties(sale_date);
CREATE INDEX IF NOT EXISTS idx_properties_land_registry_id ON properties(land_registry_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 