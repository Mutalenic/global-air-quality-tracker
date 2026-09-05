import React from 'react';
import { cn } from '../../utils/cn';

interface FlexProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: Partial<Pick<FlexProps, 'direction' | 'align' | 'justify' | 'wrap'>>;
    md?: Partial<Pick<FlexProps, 'direction' | 'align' | 'justify' | 'wrap'>>;
    lg?: Partial<Pick<FlexProps, 'direction' | 'align' | 'justify' | 'wrap'>>;
    xl?: Partial<Pick<FlexProps, 'direction' | 'align' | 'justify' | 'wrap'>>;
  };
}

const Flex: React.FC<FlexProps> = ({
  children,
  className,
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = 'nowrap',
  gap = 'none',
  responsive,
}) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const wrapClasses = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };

  const gapClasses = {
    none: '',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const getResponsiveClasses = (breakpoint: 'sm' | 'md' | 'lg' | 'xl', props: any) => {
    const classes = [];
    if (props.direction) classes.push(`${breakpoint}:${directionClasses[props.direction as keyof typeof directionClasses]}`);
    if (props.align) classes.push(`${breakpoint}:${alignClasses[props.align as keyof typeof alignClasses]}`);
    if (props.justify) classes.push(`${breakpoint}:${justifyClasses[props.justify as keyof typeof justifyClasses]}`);
    if (props.wrap) classes.push(`${breakpoint}:${wrapClasses[props.wrap as keyof typeof wrapClasses]}`);
    return classes.join(' ');
  };

  const responsiveClasses = responsive ? {
    sm: responsive.sm ? getResponsiveClasses('sm', responsive.sm) : '',
    md: responsive.md ? getResponsiveClasses('md', responsive.md) : '',
    lg: responsive.lg ? getResponsiveClasses('lg', responsive.lg) : '',
    xl: responsive.xl ? getResponsiveClasses('xl', responsive.xl) : '',
  } : {};

  const flexClasses = cn(
    'flex',
    directionClasses[direction],
    alignClasses[align],
    justifyClasses[justify],
    wrapClasses[wrap],
    gapClasses[gap],
    responsiveClasses.sm,
    responsiveClasses.md,
    responsiveClasses.lg,
    responsiveClasses.xl,
    className,
  );

  return <div className={flexClasses}>{children}</div>;
};

export default Flex;
