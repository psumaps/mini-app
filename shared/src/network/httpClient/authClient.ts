import axios, { AxiosError } from 'axios';
import api from '../api';

interface JwtResponse {
  jwt: string;
}

const client = {
  /**
   * Обмен iCal токена на JWT токен
   * @param icalToken - 16-значный iCal токен
   * @returns JWT токен
   * @throws AxiosError с кодом 401 если токен невалиден
   */
  exchangeIcalForJwt: async (icalToken: string): Promise<string> => {
    try {
      const response = await axios.post<JwtResponse>(
        `${api.mapi}/auth`,
        { token: icalToken },
        {
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000),
        },
      );
      return response.data.jwt;
    } catch (e) {
      if (e instanceof AxiosError) {
        throw e;
      }
      throw new Error('Unexpected error during token exchange');
    }
  },

  /**
   * Валидация JWT токена через /v2/ping
   * @param jwtToken - JWT токен
   * @returns true если токен валиден
   */
  validateJwt: async (jwtToken: string): Promise<boolean | null> => {
    try {
      await axios.get(`${api.mapi}/ping`, {
        headers: { Authorization: jwtToken },
        signal: AbortSignal.timeout(3000),
      });
      return true;
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 401) {
          return false;
        }
      }
      return null;
    }
  },
};

export default client;
