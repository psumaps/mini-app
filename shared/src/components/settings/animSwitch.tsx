import React, { useEffect } from 'react';

import useTryQueryClient from '../../hooks/useTryQueryClient';
import IStorage from '../../models/storage';
import { getStoredAnimEnabled } from '../../utils/readStorage';

/**
 * Рисует переключатель анимаций.
 *
 * @param {string} className - Спецификация классов для переключателя.
 * @param {T extends IStorage} storage - Специальное для модуля хранилище.
 */
const AnimSwitch = <T extends IStorage>({
  className,
  storage,
}: {
  className?: string;
  storage: T;
}) => {
  const queryClient = useTryQueryClient();
  const [isAnimEnabled, setIsAnimEnabled] = React.useState(true);

  const toggleAnimEnabled = () => {
    void storage.set('animation_enabled', !isAnimEnabled ? '1' : '0');
    setIsAnimEnabled(!isAnimEnabled);
    void queryClient.invalidateQueries({ queryKey: ['animation_enabled'] });
  };

  useEffect(() => {
    const getAnimEnabled = async () => {
      const fetched = await getStoredAnimEnabled(storage);
      if (fetched !== isAnimEnabled) setIsAnimEnabled(fetched);
    };
    void getAnimEnabled();
  }, [isAnimEnabled, storage]);

  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      className={`${className} w-fit h-fit py-4 px-2 relative`}
      onClick={toggleAnimEnabled}
      title={isAnimEnabled ? 'Отключить анимации' : 'Включить анимации'}
      type="button"
    >
      <div className="w-10 h-4 rounded-full bg-c_secondary dark:bg-cd_secondary z-0" />
      <div
        className={`w-8 h-8 rounded-full absolute top-0 left-0 translate-y-2 ${isAnimEnabled && 'transition'} transform-gpu active:scale-90
          ${isAnimEnabled ? 'bg-c_accent' : 'bg-c_inactive dark:bg-cd_bg-c_inactive translate-x-6'}`}
      />
    </button>
  );
};

export default AnimSwitch;
