import axios from 'axios';
import Poi from '../models/mapi/poi';
import api from '../api';

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

const client = {
  getPoiById: async (type: string, id: string): Promise<Poi> => {
    const response = await axios.get(`${api.mapi}/poi/${type}:${id}`);
    return response.data;
  },
  getAmenityList: async (): Promise<string[]> => {
    const response = await axios.get(`${api.mapi}/amenity`);
    return (response.data as string[]).filter(
      (item) => item !== null && item !== 'yes',
    );
  },
  getPoiByAmenity: async (amenity: string): Promise<Poi[]> => {
    const response = await axios.get(`${api.mapi}/amenity/${amenity}`);
    return response.data.collection;
  },
  search: async (
    query: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<Poi[]> => {
    const response = await axios.get(
      `${api.mapi}/search/${query}?limit=${limit}&offset=${offset}`,
    );
    return response.data.collection;
  },
};

export default client;
