import React from 'react';
import IStorage from '../../models/storage';
import Button from '../common/button';
import AnimSwitch from './animSwitch';
import ThemeSwitch from './themeSwitch';
import IcalTokenInput from './IcalTokenInput';

const Settings = ({ storage }: { storage: IStorage }) => {
  return (
    <>
      <div className="flex flex-row px-4 justify-between items-center mt-3 c1">
        Темная тема
        <ThemeSwitch storage={storage} />
      </div>
      <div className="flex flex-row px-4 justify-between items-center mt-3 c1">
        Включить анимации
        <AnimSwitch storage={storage} />
      </div>
      <IcalTokenInput storage={storage} className="mt-4" />
      <Button
        className="rounded-3xl bg-cd_telegram dark:bg-cd_telegram dark:text-cd_main py-4 min-h-12 w-full mt-4 c3"
        variant="contrast"
        onClick={() => window.open(import.meta.env.VITE_URL_TG_GROUP, '_blank')}
      >
        Группа в Telegram
      </Button>
      <div className="mt-auto w-full h-fit">
        <Button
          className="rounded-3xl h-12 w-full mt-3 c2"
          onClick={() =>
            window.open(import.meta.env.VITE_URL_SUPPORT, '_blank')
          }
        >
          Сообщить об ошибке
        </Button>
      </div>
    </>
  );
};

export default Settings;
