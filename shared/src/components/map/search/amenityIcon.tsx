import React from 'react';
import {
  detectAmenityImage,
  detectAmenityName,
} from '../../../network/utils/detectAmenity';

const AmenityIcon = ({
  className,
  classNameInner,
  amenity,
  handleAmenityClick,
}: {
  className?: string;
  classNameInner?: string;
  amenity: string;
  handleAmenityClick: (amenity: string) => void;
}) => {
  const Image = detectAmenityImage(amenity);
  return (
    <button
      type="button"
      onClick={() => handleAmenityClick(amenity)}
      className={`flex flex-col items-center active:scale-90 scale-100 transition-all duration-200 ease-in-out ${className}`}
    >
      <div
        className={`aspect-square size-10 rounded-full bg-c_accent justify-center items-center flex ${classNameInner}`}
      >
        <Image className="size-[60%] stroke-c_bg stroke-[0.008rem]" />
      </div>
      <p
        className={`c1 text-c_secondary dark:text-cd_secondary ${classNameInner}`}
      >
        {detectAmenityName(amenity)}
      </p>
    </button>
  );
};

export default AmenityIcon;
