// src/components/LazyImage.tsx
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number; // optional Contentful optimization
  height?: number;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className, width, height }) => {
  // Optional: add Contentful optimization params
  const optimizedSrc = `${src}?w=${width || 800}&h=${height || 600}&fit=fill`;

  return (
    <LazyLoadImage
      src={optimizedSrc}
      alt={alt}
      effect="blur"
      className={`w-full h-full object-cover ${className || ''}`}
    />
  );
};

export default LazyImage;
