import React, { useState } from 'react';
import HeartIcon from '../../assets/heart.svg?react';
import Button from './button';

const HeartButton = ({ person }: { person: boolean }) => {
  const [active, setActive] = useState(person);
  return (
    <Button
      className={`h-10 w-10 rounded-full hover:scale-110 ${active ? 'bg-red-600 dark:bg-red-600' : ''}`}
      onClick={() => {
        setActive(!active);
      }}
      title={active ? 'Удалить из избранного' : 'Добавить в избранное'}
    >
      <HeartIcon
        className={`stroke-0 ${active ? 'fill-cd_main' : 'dark:fill-cd_main'}`}
      />
    </Button>
  );
};

export default HeartButton;
