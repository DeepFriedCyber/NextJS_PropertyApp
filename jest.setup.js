// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};

// Mock window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock Google Maps
jest.mock('@googlemaps/js-api-loader', () => ({
  Loader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue({
      maps: {
        Map: jest.fn(),
        Marker: jest.fn(),
        InfoWindow: jest.fn(),
        LatLng: jest.fn(),
        places: {
          PlacesService: jest.fn(),
        },
      },
    }),
  })),
}));

// Mock Xata client
jest.mock('@/lib/xata', () => ({
  getXataClient: jest.fn(() => ({
    db: {
      properties: {
        query: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    },
  })),
}));

// Add any other global test setup here 