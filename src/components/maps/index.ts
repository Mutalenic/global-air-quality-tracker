// Export all map components from a single file
export { default as InteractiveMap } from './InteractiveMap';
export { default as RegionMap } from './RegionMap';
export { default as AQIMap } from './AQIMap';

// Import components for type exports
import InteractiveMap from './InteractiveMap';
import RegionMap from './RegionMap';
import AQIMap from './AQIMap';

// Re-export types for TypeScript users
export type InteractiveMapProps = React.ComponentProps<typeof InteractiveMap>;
export type RegionMapProps = React.ComponentProps<typeof RegionMap>;
export type AQIMapProps = React.ComponentProps<typeof AQIMap>;
