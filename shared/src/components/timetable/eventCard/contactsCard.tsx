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
    <div className="container flex flex-row flex-nowrap items-center mt-2 gap-3">
      {organizer.photo ? (
        <img
          className="size-16 min-h-16 min-w-16 rounded-full"
          src={organizer.photo.url}
          alt="Организатор"
        />
      ) : (
        <AvatarIcon className="fill-c_main dark:fill-cd_main size-16 min-h-16 min-w-16" />
      )}
      <div className="mx-2">
        <p className="mt-2 mb-1 c1 font-bold">{organizer.name}</p>
        <p className="c1">{organizer.description}</p>
      </div>
    </div>
  );
};

export default ContactsCard;
