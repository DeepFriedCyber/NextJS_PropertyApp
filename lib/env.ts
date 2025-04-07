/**
 * Type-safe environment variables
 */
export const env = {
  // Next Auth
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'your-secret-key',
  
  // Database
  XATA_API_KEY: process.env.XATA_API_KEY || '',
  XATA_BRANCH: process.env.XATA_BRANCH || 'main',
  
  // API Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  
  // Feature flags
  ENABLE_SEMANTIC_SEARCH: process.env.ENABLE_SEMANTIC_SEARCH === 'true',
  
  // Validation
  isProduction: process.env.NODE_ENV === 'production',
  
  /**
   * Validates that all required environment variables are set
   * @returns True if all required variables are set, false otherwise
   */
  validate: () => {
    const requiredVars = [
      'NEXTAUTH_SECRET',
      'XATA_API_KEY'
    ];
    
    const missingVars = requiredVars.filter(
      (name) => !process.env[name]
    );
    
    if (missingVars.length > 0) {
      console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
      return false;
    }
    
    return true;
  }
};