import axios from 'axios';
import Poi from '../models/mapi/poi';
import api from '../api';

const client = {
  getPoiById: async (type: string, id: string) => {
    const response = await axios.get<Poi>(`${api.mapi}/poi/${type}:${id}`);
    return response.data;
  },
  getAmenityList: async () => {
    const response = await axios.get<{ collection: string[] }>(
      `${api.mapi}/amenity`,
    );
    return response.data.collection.filter(
      (item) => item !== null && item !== 'yes',
    );
  },
  getPoiByAmenity: async (amenity: string) => {
    const response = await axios.get<{ collection: Poi[] }>(
      `${api.mapi}/amenity/${amenity}`,
    );
    return response.data.collection;
  },
  search: async (query: string, limit: number = 10, offset: number = 0) => {
    const response = await axios.get<{ collection: Poi[] }>(
      `${api.mapi}/search/${query}?limit=${limit}&offset=${offset}`,
    );
    return response.data.collection;
  },
};

export default client;
