import { getProperties, getPropertiesByIds, searchProperties } from '../lib/db';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic query
    const result = await getProperties(1, 10);
    console.log('Basic query result:', {
      propertiesCount: result.properties.length,
      total: result.total,
      totalPages: result.totalPages
    });

    // Test search
    const searchResult = await searchProperties('test');
    console.log('Search result:', {
      propertiesFound: searchResult.length
    });

    // Test get by IDs (if we have any properties)
    if (result.properties.length > 0) {
      const ids = result.properties.slice(0, 2).map(p => p.id);
      const byIdsResult = await getPropertiesByIds(ids);
      console.log('Get by IDs result:', {
        requestedIds: ids.length,
        foundProperties: byIdsResult.length
      });
    }

    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testConnection(); 