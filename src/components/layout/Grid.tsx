import React from 'react';
import { cn } from '../../utils/cn';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
  gap?: 'none' | 'sm' | 'md' | 'lg';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
  };
}

const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = 1,
  gap = 'md',
  responsive,
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    auto: 'grid-cols-auto',
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const responsiveClasses = responsive ? {
    sm: responsive.sm ? `sm:${colsClasses[responsive.sm]}` : '',
    md: responsive.md ? `md:${colsClasses[responsive.md]}` : '',
    lg: responsive.lg ? `lg:${colsClasses[responsive.lg]}` : '',
    xl: responsive.xl ? `xl:${colsClasses[responsive.xl]}` : '',
  } : {};

  const gridClasses = cn(
    'grid',
    colsClasses[cols],
    gapClasses[gap],
    responsiveClasses.sm,
    responsiveClasses.md,
    responsiveClasses.lg,
    responsiveClasses.xl,
    className,
  );

  return <div className={gridClasses}>{children}</div>;
};

export default Grid;
