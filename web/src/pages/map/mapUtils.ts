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
    if (icalData) {
      params.headers = { Authorization: `Bearer ${icalData}` };
      params.url = params.url.replace(/pub/, '');
    }

    const tiles = await queryClient.fetchQuery({
      queryFn: async () =>
        httpClient.tile.getTile(
          params.url,
          params.headers as {
            Authorization: string | undefined;
          },
        ),
      queryKey: ['tiles', params.url.split('tiles')[2]],
      staleTime: 12 * 60 * 60 * 1000,
    });

    return { data: copyBuffer(tiles) };
  });
};

const copyBuffer = (src: ArrayBuffer): ArrayBuffer => {
  const dst = new ArrayBuffer(src.byteLength);
  new Uint8Array(dst).set(new Uint8Array(src));
  return dst;
};

export default registerProtocol;
