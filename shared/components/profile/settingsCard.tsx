import React from 'react';
// eslint-disable-next-line import/no-relative-packages
import Storage from '../../../web/src/app/storage';
import Block from '../common/block';
import UserCard from './userCard';
import Layout from '../common/layout';
import ThemeSwitch from '../common/themeSwitch';
import Button from '../common/button.tsx';

const SettingsCard = () => {
  return (
    <Block className="p-[0_!important]">
      <Layout>
        <UserCard />
        <div className="flex flex-row px-4 justify-between items-center mt-8">
          <h3>Темная тема</h3>
          <ThemeSwitch storage={new Storage()} />
        </div>
        <Button
          className="rounded-3xl h-12 w-full my-4 c3"
          isContrast
          onClick={() => window.open('https://ya.ru/', '_blank')}
        >
          Привязать профиль ЕТИС
        </Button>
        <Button
          className="rounded-3xl bg-c_secondary dark:bg-cd_telegram dark:text-cd_main h-12 w-full my-4 c3"
          isContrast
          onClick={() => window.open('https://ya.ru/', '_blank')}
        >
          Группа в Telegram
        </Button>

        <Button
          className="rounded-3xl h-12 w-full my-4 c1"
          isContrast
          onClick={() => window.open('https://ya.ru/', '_blank')}
        >
          Сообщить об ошибке
        </Button>
      </Layout>
    </Block>
  );
};

export default SettingsCard;
