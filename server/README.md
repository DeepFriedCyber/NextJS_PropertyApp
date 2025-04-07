# Property App MCP Server

This is the MCP (Microservice Control Plane) server for the Property App. It handles property data management, search, and filtering operations.

## Features

- Property listing with pagination
- Property search with filters
- Property details by ID
- Caching with Redis
- Logging with Winston
- PostgreSQL database integration

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Redis
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/property_app
   REDIS_URL=redis://localhost:6379
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Properties

- `GET /api/properties` - List properties with pagination
  - Query parameters:
    - `page` (default: 1)
    - `limit` (default: 10)
    - `status` (optional)

- `GET /api/properties/:id` - Get property by ID

- `GET /api/properties/search` - Search properties
  - Query parameters:
    - `query` - Search term
    - `filters` - JSON string of filters

## Development

- The server uses TypeScript for type safety
- Winston for logging
- PostgreSQL for data storage
- Redis for caching
- Express for the web server

## Testing

Run tests with:
```bash
npm test
```

## Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
``` 