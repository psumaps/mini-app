import React, { useEffect } from 'react';

import IStorage from '../../models/storage';
import getStoredTheme from '../../utils/readTheme';
import useAnimEnabled from '../../hooks/useAnimEnabled';

const INITIAL_STATE = false;

/**
 * Рисует переключатель темы. Работает вместе с навигацией
 * (внутри навигации читается текущая тема и применяется)
 * класс 'dark' к html элементу в зависимости от темы.
 *
 * @param {string} className - Спецификация классов для переключателя.
 * @param {T extends IStorage} storage - Специальное для модуля хранилище.
 */
const ThemeSwitch = <T extends IStorage>({
  className,
  storage,
}: {
  className?: string;
  storage: T;
}) => {
  const { data: animEnabled } = useAnimEnabled();
  const [isDark, setIsDark] = React.useState(INITIAL_STATE);

  const toggleTheme = () => {
    void storage.set('theme', !isDark ? 'dark' : 'light');
    setIsDark(!isDark);
  };

  useEffect(() => {
    const getTheme = async () => {
      const fetched = await getStoredTheme(storage);
      if (fetched !== INITIAL_STATE) setIsDark(fetched);
    };
    void getTheme();
  }, [storage]);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      className={`${className} w-fit h-fit py-4 px-2 relative`}
      onClick={toggleTheme}
      title={isDark ? 'Light mode' : 'Dark mode'}
      type="button"
    >
      <div className="w-10 h-4 rounded-full bg-c_secondary dark:bg-cd_secondary z-0" />
      <div
        className={`w-8 h-8 rounded-full absolute top-0 left-0 translate-y-2 ${animEnabled && 'transition'} transform-gpu active:scale-90
          ${isDark ? 'bg-slate-300 translate-x-6' : 'bg-yellow-400 '}`}
      >
        <div
          className={`w-6 h-6 rounded-full absolute bg-c_bg dark:bg-cd_bg top-[0.1rem] right-[-0.1rem] ${animEnabled && 'transition'} transform 
            ${isDark ? 'opacity-100' : 'opacity-0 -translate-x-6'}`}
        />
      </div>
    </button>
  );
};

export default ThemeSwitch;
