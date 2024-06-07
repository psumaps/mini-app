import axios from 'axios';
import Poi from '../models/mapi/poi';
import api from '../api';

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const client = {
  getPoiById: async (type: string, id: string): Promise<Poi> => {
    return axios
      .get(`${api.mapi}/poi/${type}:${id}`)
      .then((response) => response.data);
  },
  getAmenityList: async (): Promise<string[]> => {
    return axios
      .get(`${api.mapi}/amenity`)
      .then((response) =>
        (response.data as string[]).filter(
          (item) => item !== null && item !== 'yes',
        ),
      );
  },
  getPoiByAmenity: async (amenity: string): Promise<Poi[]> => {
    return axios
      .get(`${api.mapi}/amenity/${amenity}`)
      .then((response) => response.data.collection);
  },
  search: async (
    query: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<Poi[]> => {
    return axios
      .get(`${api.mapi}/search/${query}?limit=${limit}&offset=${offset}`)
      .then((response) => response.data.collection);
  },
};

export default client;
