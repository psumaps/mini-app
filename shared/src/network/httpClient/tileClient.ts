import axios from 'axios';

const client = {
  getTile: async (url: string, headers?: { Authorization: string }) => {
    return axios.get<ArrayBuffer>(url, {
      headers,
      responseType: 'arraybuffer',
    });
  },
};

export default client;
