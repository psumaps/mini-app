import React from "react";
import AvatarIcon from "../../assets/avatar.svg?react";

function ContactsCard(props: any, ) {
  return (
    <div>
      <h2 className="mt-7">Контакты:</h2>
      <h3 className="mt-1">Организаторы/ спикеры</h3>
      <div className="container flex flex-row flex-nowrap items-center pb-1.5">
          <AvatarIcon className="fill-c_main dark:fill-cd_main" />
          <div className=" ml-2 mr-2 ">
              <h4 className="mt-2 mb-1 dark:text-cd_main text-neutral-700">
                  Организатор
              </h4>
              <p className="c1">{props.organizer ?? "Неизвестно"}</p>
          </div>
      </div>
    </div>
  );
}

export default ContactsCard;
