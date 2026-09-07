// Export all UI components from a single file
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as LoadingSpinner } from './LoadingSpinner';

// Import components for type exports
import type { ComponentProps } from 'react';
import Button from './Button';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

// Re-export types for TypeScript users
export type ButtonProps = ComponentProps<typeof Button>;
export type CardProps = ComponentProps<typeof Card>;
export type LoadingSpinnerProps = ComponentProps<typeof LoadingSpinner>;
