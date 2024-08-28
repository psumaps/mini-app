import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import LinkIcon from '../../../assets/link.svg?react';
import Button from '../../common/button';

const ShareButton = ({ id }: { id: number }) => {
  const handleClick = () => {
    void bridge.send('VKWebAppShare', {
      link: `${import.meta.env.VITE_URL_VK_APP}${id}`,
    });
  };
  return (
    <Button className="h-10 w-10 rounded-full shadow" onClick={handleClick}>
      <LinkIcon className="stroke-0 fill-c_main dark:fill-cd_main" />
    </Button>
  );
};

export default ShareButton;
