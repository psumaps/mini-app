import axios from 'axios';
import Poi from '../models/mapi/poi';
import api from '../api';

const tokenHeader = (token: string) => ({
  headers: { Authorization: `${token}` },
  signal: AbortSignal.timeout(3000),
});

const badAmenities = ['community_centre', 'yes', 'main'];
const client = {
  getIndoorById: async (id: string, token: string) => {
    const response = await axios.get<Poi>(
      `${api.mapi}/indoor?query_id=${id}`,
      tokenHeader(token),
    );
    return response.data;
  },
  getPublicIndoorById: async (id: string) => {
    const response = await axios.get<Poi>(
      `${api.mapi}/public/indoor?query_id=${id}`,
    );
    return response.data;
  },
  getAmenityList: async (jwtToken: string) => {
    const response = await axios.get<{ collection: string[] }>(
      `${api.mapi}/amenitys`,
      tokenHeader(jwtToken),
    );
    return response.data.collection.filter(
      (item) => !!item && !badAmenities.includes(item) && /[\w_]+/.test(item),
    );
  },
  getPoiByAmenity: async (amenity: string, jwtToken: string) => {
    const response = await axios.get<{ collection: Poi[] }>(
      `${api.mapi}/amenity?query_name=${amenity}`,
      tokenHeader(jwtToken),
    );
    return response.data.collection;
  },
  search: async (
    query: string,
    jwtToken: string,
    limit: number = 10,
    offset: number = 0,
  ) => {
    const response = await axios.get<{ collection: Poi[] }>(
      `${api.mapi}/search?query_name=${query}&limit=${limit}&offset=${offset}`,
      tokenHeader(jwtToken),
    );
    return response.data.collection;
  },
};

export default client;
