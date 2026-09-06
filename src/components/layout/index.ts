// Export all layout components from a single file
export { default as Container } from './Container';
export { default as Grid } from './Grid';
export { default as Flex } from './Flex';

// Import components for type exports
import type { ComponentProps } from 'react';
import Container from './Container';
import Grid from './Grid';
import Flex from './Flex';

// Re-export types for TypeScript users
export type ContainerProps = ComponentProps<typeof Container>;
export type GridProps = ComponentProps<typeof Grid>;
export type FlexProps = ComponentProps<typeof Flex>;
