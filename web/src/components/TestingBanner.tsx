import React, { useEffect, useState } from 'react';
import { useNotification } from 'psumaps-shared/src/components/common/notification';
import Button from 'psumaps-shared/src/components/common/button';

const FORM_URL = 'https://forms.gle/KyrNQzpyyNiuwVMf6';
const BANNER_STORAGE_KEY = 'testing_banner_closed';

interface TestingBannerProps {
  onVisibilityChange?: (isVisible: boolean) => void;
}

const TestingBanner: React.FC<TestingBannerProps> = ({
  onVisibilityChange,
}) => {
  const { showNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isClosed = localStorage.getItem(BANNER_STORAGE_KEY) === 'true';
    setIsVisible(!isClosed);
    onVisibilityChange?.(!isClosed);
  }, [onVisibilityChange]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(FORM_URL, '_blank');
    showNotification('Спасибо за участие в тестировании!', 'success');
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem(BANNER_STORAGE_KEY, 'true');
    setIsVisible(false);
    onVisibilityChange?.(false);
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleClick}
      className="absolute top-4 right-4 z-40 cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 max-w-xs"
    >
      <div className="px-4 py-3 flex items-center gap-2 relative pr-8">
        <span role="img" aria-label="testing" className="text-lg">
          🚀
        </span>
        <p className="text-sm font-medium text-gray-800 dark:text-white">
          Примите участие в тестировании приложения!
        </p>
        <Button
          onClick={handleClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Закрыть баннер"
        >
          ✕
        </Button>
      </div>
    </div>
  );
};

export default TestingBanner;
