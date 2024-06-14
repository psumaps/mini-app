import amenityList from '../models/mapi/amenity';
import Poi from '../models/mapi/poi';

const detectAmenity = (item: Poi) => {
  if (item.properties.tags.amenity)
    return amenityList[item.properties.tags.amenity];

  if (item.properties.ref) return 'Аудитория';

  return null;
};

export default detectAmenity;
