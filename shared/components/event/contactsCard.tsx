import React from 'react';
// @ts-ignore
import AvatarIcon from "~/../../shared/assets/avatar.svg?react";

function ContactsCard() {

  return (
    <div>
      <div className="mt-8 text-lg text-neutral-700">Контакты:</div>
    <div className="mt-2 text-lg text-neutral-700">Организаторы/ спикеры</div>
    <div className="container flex flex-row flex-nowrap items-center">
      <AvatarIcon className="fill-zinc-800 " />
      <div className="mt-2 ml-2 mr-2 w-full">
        <h4 className="mt-2 mb-1 text-neutral-700">Организатор</h4>
        <h5>Описание</h5>
      </div>
    </div>
    </div>
);
}

export default ContactsCard;
