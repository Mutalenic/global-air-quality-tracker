import { useState, useEffect, useRef, useMemo } from 'react';
import { VirtualScroller } from '../utils/performance';

interface UseVirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
}

interface UseVirtualListReturn<T> {
  visibleItems: { item: T; index: number; top: number }[];
  totalHeight: number;
  scrollElementProps: {
    onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
    style: React.CSSProperties;
  };
}

export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
}: UseVirtualListProps<T>): UseVirtualListReturn<T> {
  const [scrollTop, setScrollTop] = useState(0);
  const virtualScroller = useRef(
    new VirtualScroller(items, itemHeight, containerHeight)
  );

  useEffect(() => {
    virtualScroller.current = new VirtualScroller(items, itemHeight, containerHeight);
  }, [items, itemHeight, containerHeight]);

  useEffect(() => {
    virtualScroller.current.setScrollTop(scrollTop);
  }, [scrollTop]);

  const visibleItems = useMemo(() => {
    return virtualScroller.current.getVisibleItems();
  }, [scrollTop, items]);

  const totalHeight = useMemo(() => {
    return virtualScroller.current.getTotalHeight();
  }, [items]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return {
    visibleItems,
    totalHeight,
    scrollElementProps: {
      onScroll: handleScroll,
      style: {
        height: containerHeight,
        overflow: 'auto',
      },
    },
  };
}
