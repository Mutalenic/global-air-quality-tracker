import { useEffect } from 'react';

/**
 * Hook to detect keyboard navigation and add appropriate class
 */
export const useKeyboardNavigation = () => {
  useEffect(() => {
    function handleMouseDownOnce() {
      document.body.classList.remove('keyboard-user');
      window.removeEventListener('mousedown', handleMouseDownOnce);
      window.addEventListener('keydown', handleFirstTab);
    }

    function handleFirstTab(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
        window.removeEventListener('keydown', handleFirstTab);
        window.addEventListener('mousedown', handleMouseDownOnce);
      }
    }

    window.addEventListener('keydown', handleFirstTab);

    return () => {
      window.removeEventListener('keydown', handleFirstTab);
      window.removeEventListener('mousedown', handleMouseDownOnce);
    };
  }, []);
};

/**
 * Hook for ARIA live region announcements
 */
export const useAriaAnnounce = () => {
  useEffect(() => {
    // Create ARIA live region if it doesn't exist
    let liveRegion = document.getElementById('aria-live-region');

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.className = 'aria-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }

    return () => {
      // Cleanup on unmount
      const region = document.getElementById('aria-live-region');
      if (region && !document.querySelector('[data-keep-aria-region]')) {
        region.remove();
      }
    };
  }, []);

  const announce = (message, priority = 'polite') => {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  };

  return { announce };
};

/**
 * Hook to manage focus trap for modals/dialogs
 */
export const useFocusTrap = (isActive, containerRef) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) {
      return undefined;
    }

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    container.addEventListener('keydown', handleTabKey);
    if (firstElement) firstElement.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, containerRef]);
};
