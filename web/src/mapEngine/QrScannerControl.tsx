import { useCallback } from 'react';
import { useControl } from 'react-map-gl/maplibre';
import bridge from '@vkontakte/vk-bridge';
import { qrScanner } from '@telegram-apps/sdk-react';
import { BridgeType } from 'psumaps-shared/src/models/storage';
import QrIconUrl from 'psumaps-shared/src/assets/qr.svg';

interface QrScannerProps {
  onScan: (code: string) => void;
  bridgeType: BridgeType;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

function processQrCode(code_data: string): string {
  if (!code_data) return '';

  try {
    let url: URL;
    try {
      url = new URL(code_data);
    } catch {
      return code_data;
    }

    if (url.hash && url.hash.length > 1) {
      return url.hash.substring(1);
    }

    if (url.search && url.search.length > 1) {
      return url.search.substring(1);
    }

    return code_data;
  } catch (error) {
    return code_data;
  }
}

const QrScannerControl = ({
  onScan,
  bridgeType,
  position = 'bottom-right',
}: QrScannerProps) => {
  const handleClick = useCallback(() => {
    if (bridgeType === BridgeType.tgconnect) {
      void qrScanner.open({
        text: 'Scan the QR code',
        capture: (code_data: string) => {
          if (code_data) {
            const processedCode = processQrCode(code_data);
            onScan(processedCode);
            qrScanner.close();
            return true;
          }
          return false;
        },
      });
    } else if (bridgeType === BridgeType.vkbridge) {
      void bridge.send('VKWebAppOpenCodeReader').then((data) => {
        if (data?.code_data) {
          const processedCode = processQrCode(data.code_data);
          onScan(processedCode);
        }
      });
    }
  }, [bridgeType, onScan]);

  useControl(
    () => {
      return {
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
          // Cleanup any event listeners if needed
        },
      };
    },
    { position },
  );

  return null;
};

export default QrScannerControl;
