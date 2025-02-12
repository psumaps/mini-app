import axios from 'axios';

const client = {
  getTile: async (
    url: string,
    headers: { Authorization: string | undefined },
  ) => {
    const response = await axios.get<ArrayBuffer>(url, {
      headers,
      responseType: 'arraybuffer',
    });
    return response.data;
  },
};

export default client;
