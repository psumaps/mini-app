import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNotification } from 'psumaps-shared/src/components/common/notification';
import Button from 'psumaps-shared/src/components/common/button';
import { useSharedMapContext } from 'psumaps-shared/src/contexts/SharedMapContext';
import { useMapContext } from '~/pages/map/contexts/MapContext';

const FORM_URL = 'https://forms.gle/KyrNQzpyyNiuwVMf6';
const BANNER_STORAGE_KEY = 'testing_banner_closed';

const TestingBanner: React.FC = () => {
  const { showNotification } = useNotification();
  const { popupState } = useSharedMapContext();
  const { setIsBannerVisible: onVisibilityChange } = useMapContext();
  const [isVisible, setIsVisible] = useState(true);
  const [isTempHidden, setIsTempHidden] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (popupState === 'opened') {
      setIsTempHidden(true);
    } else if (popupState === 'closed' || popupState === 'middle') {
      const timer = setTimeout(() => {
        setIsTempHidden(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [popupState]);

  useEffect(() => {
    const isClosed = localStorage.getItem(BANNER_STORAGE_KEY) === 'true';
    setIsVisible(!isClosed);
    onVisibilityChange?.(!isClosed);
  }, [onVisibilityChange]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      showNotification('Спасибо за участие в тестировании!', 'success');
      localStorage.setItem(BANNER_STORAGE_KEY, 'true');
      window.open(FORM_URL, '_blank');
    },
    [showNotification],
  );

  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsClosing(true);
      setTimeout(() => {
        localStorage.setItem(BANNER_STORAGE_KEY, 'true');
        setIsVisible(false);
        onVisibilityChange?.(false);
      }, 500);
    },
    [onVisibilityChange],
  );

  if (!isVisible || isTempHidden) return null;

  return (
    <div
      ref={bannerRef}
      onClick={handleClick}
      className={`absolute top-4 right-4 z-40 cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 max-w-xs ${isClosing ? 'animate-slide-out-right' : ''}`}
      style={{
        animation: isClosing ? 'slideOutRight 0.5s forwards' : undefined,
      }}
    >
      <div className="px-4 py-3 flex items-center gap-2 relative pr-8">
        <span
          role="img"
          aria-label="testing"
          className="text-lg rocket-animation"
        >
          🚀
        </span>
        <p className="text-sm font-medium text-gray-800 dark:text-white">
          Примите участие в тестировании приложения!
        </p>
        <Button
          onClick={handleClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800"
          aria-label="Закрыть баннер"
        >
          ✕
        </Button>
      </div>
      <style>{`
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        .animate-slide-out-right {
          animation: slideOutRight 0.5s forwards;
        }
        
        @keyframes rocketPulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .rocket-animation {
          display: inline-block;
          animation: rocketPulse 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TestingBanner;
