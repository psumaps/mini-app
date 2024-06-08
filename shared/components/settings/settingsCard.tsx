import React from 'react';
import UserCard from './userCard';
import Layout from '../common/layout';
import ThemeSwitch from '../common/themeSwitch';
import Button from '../common/button';
import IStorage from '../../models/storage';

const SettingsCard = ({ storage }: { storage: IStorage }) => {
  return (
    <Layout>
      <UserCard />
      <div className="flex flex-row px-4 justify-between items-center mt-3 c1">
        Темная тема
        <ThemeSwitch storage={storage} />
      </div>
      <Button
        className="rounded-3xl h-12 w-full mt-5 c3"
        isContrast
        onClick={() => window.open('https://ya.ru/', '_blank')}
      >
        Привязать профиль ЕТИС
      </Button>
      <Button
        className="rounded-3xl bg-c_secondary dark:bg-cd_telegram dark:text-cd_main h-12 w-full my-3 c3"
        isContrast
        onClick={() => window.open('https://t.me/psumaps', '_blank')}
      >
        Группа в Telegram
      </Button>

      <Button
        className="absolute bottom-14 rounded-3xl h-12 w-[90%] c1"
        onClick={() => window.open('https://t.me/psumaps', '_blank')}
      >
        Сообщить об ошибке
      </Button>
    </Layout>
  );
};

export default SettingsCard;
