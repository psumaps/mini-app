import { useCallback, useMemo } from 'react';
import { useControl } from 'react-map-gl/maplibre';
import bridge from '@vkontakte/vk-bridge';
import { qrScanner } from '@telegram-apps/sdk-react';
import { BridgeType } from 'psumaps-shared/src/models/storage';
import QrIconUrl from 'psumaps-shared/src/assets/qr.svg';
import useDeterminateBridge from 'psumaps-shared/src/hooks/useDeterminateBridge';
import useLocationHash from 'psumaps-shared/src/hooks/useLocationHash';

interface QrScannerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const processQrCode = (code_data: string): string => {
  if (!code_data) return '';

  try {
    const url = new URL(code_data);
    if (url.hash && url.hash.length > 1) {
      return url.hash.substring(1);
    }
    if (url.search && url.search.length > 1) {
      return url.search.substring(1);
    }
    return code_data;
  } catch {
    return code_data;
  }
};

const QrScannerControl = ({ position = 'bottom-right' }: QrScannerProps) => {
  const bridgeType = useDeterminateBridge();
  const { safeHandleLocationHash } = useLocationHash();

  const handleScan = useCallback(
    (code_data: string) => {
      if (code_data) {
        const processedCode = processQrCode(code_data);
        safeHandleLocationHash(processedCode);

        return true;
      }
      return false;
    },
    [safeHandleLocationHash],
  );

  const scannerConfig = useMemo(
    () => ({
      tg: {
        open: () => {
          void qrScanner.open({
            text: 'Scan the QR code',
            capture: (code_data: string) => {
              const result = handleScan(code_data);
              if (result) qrScanner.close();
              return result;
            },
          });
        },
      },
      vk: {
        open: () => {
          void bridge.send('VKWebAppOpenCodeReader').then((data) => {
            if (data?.code_data) {
              handleScan(data.code_data);
            }
          });
        },
      },
    }),
    [handleScan],
  );

  const handleClick = useCallback(() => {
    const scanner =
      bridgeType === BridgeType.tgconnect ? scannerConfig.tg : scannerConfig.vk;
    scanner.open();
  }, [bridgeType, scannerConfig]);

  useControl(
    () => ({
      onAdd() {
        const container = document.createElement('div');
        container.className = 'maplibregl-ctrl maplibregl-ctrl-group';

        const button = document.createElement('button');
        button.type = 'button';
        button.title = 'QR Scanner';
        button.setAttribute('aria-label', 'QR Scanner');
        button.addEventListener('click', handleClick);

        const icon = document.createElement('img');
        icon.src = QrIconUrl;
        icon.alt = 'QR Scanner';
        icon.style.margin = '0 auto';
        button.appendChild(icon);
        container.appendChild(button);

        return container;
      },
      onRemove() {
        // Cleanup if needed
      },
    }),
    { position },
  );

  return null;
};

export default QrScannerControl;
