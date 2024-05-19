import React from "react";
import AvatarIcon from "../../assets/avatar.svg?react";

function ContactsCard() {
  return (
    <div>
      <div className="mt-7 text-lg ">Контакты:</div>
      <div className="mt-1 text-base ">Организаторы/ спикеры</div>
      <div className="container flex flex-row flex-nowrap items-center">
        <AvatarIcon className="fill-zinc-800 " />
        <div className=" ml-2 mr-2 ">
          <h4 className="mt-2 mb-1 dark:text-cd_main text-neutral-700">
            Организатор
          </h4>
          <p className="c1">Описание</p>
        </div>
      </div>
    </div>
  );
}

export default ContactsCard;
