import { QueryClient } from '@tanstack/react-query';
import { addProtocol, RequestParameters } from 'maplibre-gl';
import httpClient from 'psumaps-shared/src/network/httpClient';

const registerProtocol = (
  queryClient: QueryClient,
  icalData: string | undefined,
) => {
  addProtocol('martin', async (_params: RequestParameters) => {
    const params = _params;
    params.url = params.url.replace(/^martin:\/\//, 'https://');
    let tilesResponse;
    if (icalData) {
      const url = params.url.replace(/pub/, '');
      try {
        tilesResponse = await queryClient.fetchQuery({
          queryFn: async () =>
            httpClient.tile.getTile(url, {
              Authorization: `Bearer ${icalData}`,
            }),
          queryKey: ['tiles', params.url.split('tiles')[2]],
          staleTime: 12 * 60 * 60 * 1000,
        });
      } catch (e) {
        console.log(e);
      }
    }
    if (!icalData || !tilesResponse || tilesResponse.status >= 400) {
      tilesResponse = await queryClient.fetchQuery({
        queryFn: async () => httpClient.tile.getTile(params.url),
        queryKey: ['tiles', 'pub', params.url.split('tiles')[2]],
        staleTime: 12 * 60 * 60 * 1000,
      });
    }

    return { data: copyBuffer(tilesResponse.data) };
  });
};

const copyBuffer = (src: ArrayBuffer): ArrayBuffer => {
  const dst = new ArrayBuffer(src.byteLength);
  new Uint8Array(dst).set(new Uint8Array(src));
  return dst;
};

export default registerProtocol;
