// Export all services from a single file
export { default as weatherService } from './weatherService';
export { default as airVisualService } from './airVisualService';

// Re-export for convenience
import weatherService from './weatherService';
import airVisualService from './airVisualService';

export { weatherService, airVisualService };
