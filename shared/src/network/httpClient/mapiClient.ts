import axios, { AxiosError } from 'axios';
import Poi from '../models/mapi/poi';
import api from '../api';

const tokenHeader = (token: string) => ({
  headers: { Authorization: `${token}` },
});
const client = {
  validateIcal: async (token: string) => {
    try {
      await axios.get(`${api.mapi}/ping`, tokenHeader(token));
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) return false;
      }
      return null;
    }
    return true;
  },
  getIndoorById: async (id: string, token: string) => {
    const response = await axios.get<Poi>(
      `${api.mapi}/indoor?query_id=${id}`,
      tokenHeader(token),
    );
    return response.data;
  },
  getAmenityList: async (token: string) => {
    const response = await axios.get<{ collection: string[] }>(
      `${api.mapi}/amenitys`,
      tokenHeader(token),
    );
    return response.data.collection.filter((item) => item && item !== 'yes');
  },
  getPoiByAmenity: async (amenity: string, token: string) => {
    const response = await axios.get<{ collection: Poi[] }>(
      `${api.mapi}/amenity?query_name=${amenity}`,
      tokenHeader(token),
    );
    return response.data.collection;
  },
  search: async (
    query: string,
    token: string,
    limit: number = 10,
    offset: number = 0,
  ) => {
    const response = await axios.get<{ collection: Poi[] }>(
      `${api.mapi}/search?query_name=${query}&limit=${limit}&offset=${offset}`,
      tokenHeader(token),
    );
    return response.data.collection;
  },
};

export default client;
