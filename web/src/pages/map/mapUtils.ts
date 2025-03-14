import { QueryClient } from '@tanstack/react-query';
import { addProtocol, RequestParameters } from 'maplibre-gl';
import httpClient from 'psumaps-shared/src/network/httpClient';

interface RegisterProtocolOptions {
  queryClient: QueryClient;
  token: string | undefined;
  onAuthError?: () => void;
  onSuccessAfterFallback?: () => void;
}

const registerProtocol = ({
  queryClient,
  token,
  onAuthError,
  onSuccessAfterFallback,
}: RegisterProtocolOptions) => {
  // Флаг для отслеживания использования публичных тайлов
  let isUsingPublicTiles = false;
  // Флаг для отслеживания показа уведомления об ошибке авторизации
  let hasShownAuthError = false;

  addProtocol('martin', async (_params: RequestParameters) => {
    const params = _params;
    params.url = params.url.replace(/^martin:\/\//, 'https://');
    let tilesResponse;

    if (token) {
      const url = params.url.replace(/pub/, '');
      try {
        tilesResponse = await queryClient.fetchQuery({
          queryFn: async () =>
            httpClient.tile.getTile(url, {
              Authorization: `Bearer ${token}`,
            }),
          queryKey: ['tiles', params.url.split('tiles')[2]],
          staleTime: 12 * 60 * 60 * 1000,
        });

        // Если успешно загрузили приватные тайлы после использования публичных
        if (isUsingPublicTiles && tilesResponse.status < 400) {
          if (onSuccessAfterFallback) {
            onSuccessAfterFallback();
          }
          isUsingPublicTiles = false;
        }
      } catch (e) {
        console.log(e);
        // Если произошла ошибка при загрузке приватных тайлов и еще не показывали уведомление
        if (!hasShownAuthError && onAuthError) {
          onAuthError();
          hasShownAuthError = true;
        }
      }
    }

    // Если не удалось загрузить приватные тайлы, используем публичные
    if (!token || !tilesResponse || tilesResponse.status >= 400) {
      isUsingPublicTiles = true;
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
