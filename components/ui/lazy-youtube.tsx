// components/ui/lazy-youtube.tsx
"use client";

import { useState, useEffect } from 'react';

interface LazyYouTubeProps {
  videoId: string;
  title: string;
}

export function LazyYouTube({ videoId, title }: LazyYouTubeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simple visibility detection using Intersection Observer API
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    // Create a temporary div to observe
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    observer.observe(tempDiv);

    // Clean up
    return () => {
      observer.disconnect();
      document.body.removeChild(tempDiv);
    };
  }, []);

  // Only load the iframe when the component is visible
  const shouldLoad = isVisible || isLoaded;

  return (
    <div 
      className="relative w-full overflow-hidden rounded-lg"
      style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
    >
      {shouldLoad ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
          title={title}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
        ></iframe>
      ) : (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
          {/* Simple loading placeholder instead of Skeleton */}
          <div className="animate-pulse bg-gray-300 w-full h-full"></div>
          <div className="absolute flex flex-col items-center justify-center">
            <svg 
              className="w-16 h-16 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Loading video...</p>
          </div>
        </div>
      )}
    </div>
  );
}
