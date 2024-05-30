import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import LinkIcon from '../../assets/link.svg?react';
import Button from './button';

const ShareButton = ({ id }: { id: number }) => {
  return (
    <Button
      className="h-10 w-10 rounded-full hover:scale-110"
      onClick={() => {
        void bridge.send('VKWebAppShare', {
          link: `https://vk.com/app/${id}?`,
        });
      }}
    >
      <LinkIcon className="stroke-0 fill-c_main dark:fill-cd_main" />
    </Button>
  );
};

export default ShareButton;
