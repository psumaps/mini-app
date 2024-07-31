import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import LinkIcon from '../../../assets/link.svg?react';
import Button from '../../common/button';

const ShareButton = ({ id }: { id: string }) => {
  const handleClick = () => {
    void bridge.send('VKWebAppShare', {
      link: `${import.meta.env.VITE_URL_VK_APP}#i=${id}`,
    });
  };
  return (
    <Button onTouchStartCapture={handleClick} onClick={handleClick}>
      <LinkIcon className="stroke-0 h-5 w-5 fill-c_secondary" />
    </Button>
  );
};

export default ShareButton;
