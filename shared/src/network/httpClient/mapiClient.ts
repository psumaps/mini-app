import axios from 'axios';
import Poi from '../models/mapi/poi';
import api from '../api';

const client = {
  validateIcal: async (token: string) => {
    const response = await axios.get(`${api.mapi}/amenitys`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401) return false;
    return true;
  },
  getIndoorById: async (id: string) => {
    const response = await axios.get<Poi>(`${api.mapi}/indoor?query_id=${id}`);
    return response.data;
  },
  getAmenityList: async () => {
    const response = await axios.get<{ collection: string[] }>(
      `${api.mapi}/amenitys`,
    );
    return response.data.collection.filter((item) => item && item !== 'yes');
  },
  getPoiByAmenity: async (amenity: string) => {
    const response = await axios.get<{ collection: Poi[] }>(
      `${api.mapi}/amenity?query_name=${amenity}`,
    );
    return response.data.collection;
  },
  search: async (query: string, limit: number = 10, offset: number = 0) => {
    const response = await axios.get<{ collection: Poi[] }>(
      `${api.mapi}/search?query_name=${query}&limit=${limit}&offset=${offset}`,
    );
    return response.data.collection;
  },
};

export default client;
