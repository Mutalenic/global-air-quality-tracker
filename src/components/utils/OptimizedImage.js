import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * OptimizedImage component for better image loading performance
 * - Implements lazy loading
 * - Uses intersection observer for better performance
 * - Provides a fallback while loading
 * - Ensures proper sizing to fit the screen
 */
const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  lowQualitySrc,
  fallbackSrc,
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState(lowQualitySrc || null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Only load the image if it's in the viewport
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, {
      rootMargin: '100px', // Start loading when image is 100px from viewport
    });

    // Get the current ref value
    const currentElement = document.getElementById(`img-${alt.replace(/\s+/g, '-')}`);
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [alt]);

  useEffect(() => {
    if (isVisible) {
      // Load the actual image only when visible
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImgSrc(src);
        setIsLoaded(true);
        // Store natural dimensions for aspect ratio calculation
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        // Use fallback if original image fails
        if (fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      };
    }
  }, [isVisible, src, fallbackSrc]);

  // Pass through click events directly to the image
  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }
  };

  // Calculate optimal dimensions based on container and natural image size
  const getOptimalDimensions = () => {
    // If we have explicit dimensions, use those
    if (width !== 'auto' && height !== 'auto') {
      return { width, height };
    }

    // If natural dimensions are available, preserve aspect ratio
    if (naturalSize.width > 0 && naturalSize.height > 0) {
      // Default to natural dimensions but with max constraints
      return {
        width: '100%',
        height: 'auto',
        objectFit: 'contain',
        maxWidth: naturalSize.width > 800 ? '800px' : `${naturalSize.width}px`,
      };
    }

    // Fallback dimensions
    return { width: '100%', height: 'auto', objectFit: 'contain' };
  };

  const imgDimensions = getOptimalDimensions();

  return (
    <div
      className={`optimized-image-container ${className || ''}`}
      style={{
        position: 'relative',
        pointerEvents: 'none', // This ensures the div doesn't intercept pointer events
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {onClick ? (
        <button
          type="button"
          aria-label={alt}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            display: 'block',
            width: imgDimensions.width,
            maxWidth: imgDimensions.maxWidth || '100%',
            opacity: isLoaded ? 1 : 0.5,
            transition: 'opacity 0.3s ease-in-out',
          }}
          onClick={handleClick}
        >
          <img
            id={`img-${alt.replace(/\s+/g, '-')}`}
            src={imgSrc || ''}
            alt={alt}
            loading="lazy"
            style={{
              width: '100%',
              height: imgDimensions.height,
              objectFit: imgDimensions.objectFit || 'cover',
              objectPosition: 'center',
            }}
          />
        </button>
      ) : (
        <img
          id={`img-${alt.replace(/\s+/g, '-')}`}
          src={imgSrc || ''}
          alt={alt}
          loading="lazy"
          style={{
            width: imgDimensions.width,
            height: imgDimensions.height,
            maxWidth: imgDimensions.maxWidth || '100%',
            objectFit: imgDimensions.objectFit || 'cover',
            objectPosition: 'center',
            opacity: isLoaded ? 1 : 0.5,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            pointerEvents: 'none', // Ensure the loading indicator doesn't block events
          }}
        >
          <span>Loading...</span>
        </div>
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lowQualitySrc: PropTypes.string, // Low quality placeholder image
  fallbackSrc: PropTypes.string, // Fallback if the main image fails to load
  onClick: PropTypes.func, // Click handler
};

OptimizedImage.defaultProps = {
  className: '',
  width: 'auto',
  height: 'auto',
  lowQualitySrc: null,
  fallbackSrc: null,
  onClick: null,
};

export default OptimizedImage;
