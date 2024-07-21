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
    photo?: { id: number; name: string; url: string };
  };
}) => {
  return (
    <div className="container flex flex-row flex-nowrap items-center mb-2">
      {organizer.photo ? (
        <img
          className="size-24 min-h-24 min-w-24 rounded-full"
          src={organizer.photo.url}
          alt="Организатор"
        />
      ) : (
        <AvatarIcon className="fill-c_main dark:fill-cd_main" />
      )}
      <div className="mx-2">
        <p className="mt-2 mb-1 c1 font-bold">{organizer.name}</p>
        <p className="c1">{organizer.description}</p>
      </div>
    </div>
  );
};

export default ContactsCard;
