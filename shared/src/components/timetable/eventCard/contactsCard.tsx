/// <reference types="vite-plugin-svgr/client" />
import React from 'react';
import AvatarIcon from '../../../assets/avatar.svg?react';

const ContactsCard = ({
  organizer,
}: {
  organizer: {
    id: number;
    name: string;
    description: string;
    photo: { id: number; name: string; url: string };
  };
}) => {
  return (
    <>
      <h2 className="mt-7">Контакты:</h2>
      <h3 className="mt-1">Организаторы/ спикеры</h3>
      <div className="container flex flex-row flex-nowrap items-center -mb-2.5">
        <AvatarIcon className="fill-c_main dark:fill-cd_main" />
        <div className="mx-2">
          <p className="mt-2 mb-1 c1 font-bold">Организатор</p>
          <p className="c1">{organizer.name}</p>
        </div>
      </div>
    </>
  );
};

export default ContactsCard;
