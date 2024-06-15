import { amenityNameList, amenityImageList } from '../models/mapi/amenity';
import Poi from '../models/mapi/poi';

export const detectItemAmenityName = (item: Poi) => {
  if (item.properties.tags.amenity)
    return detectAmenityName(item.properties.tags.amenity);

  if (item.properties.ref) return 'Аудитория';

  return null;
};

export const detectAmenityName = (amenity: string) => {
  return amenityNameList[amenity];
};

export const detectAmenityImage = (amenity: string) => {
  return amenityImageList[amenity];
};
