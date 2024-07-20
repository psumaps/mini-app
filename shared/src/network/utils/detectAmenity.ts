import { amenityImageList, amenityNameList } from '../models/mapi/amenity';
import Poi from '../models/mapi/poi';

export const detectItemAmenityName = (item: Poi | null) => {
  if (!item) return null;
  if (item.properties.tags?.amenity)
    return detectAmenityName(item.properties.tags?.amenity);

  if (item.properties.ref) return 'Аудитория';

  return null;
};

export const detectAmenityName = (amenity: string) => {
  return amenityNameList[amenity];
};

export const detectAmenityImage = (amenity: string) => {
  return amenityImageList[amenity];
};
