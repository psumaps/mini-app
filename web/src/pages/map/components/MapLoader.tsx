import React from 'react';

interface MapLoaderProps {
  className?: string;
}

const MapLoader: React.FC<MapLoaderProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex-[0_0_92%] flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default MapLoader;
