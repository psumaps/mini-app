// @ts-ignore
import React from "react";
import LinkIcon from '~/../../shared/assets/link.svg?react';

const LinkButton = (props: { link: any; }) => {
  return (
    <button
      className="w-[53px] h-[53px] shrink-0 aspect-square"
      onClick={() => {

        window.open(props.link, '_blank');

      }}

    >

      <div
        className={` w-[40px] h-[40px] hover:scale-110`}
      >
        <div
          className={`w-[40px] h-[40px] rounded-full  bg-amber-50`}
        >
          <LinkIcon/>
        </div>
      </div>

    </button>
  )
}


export default LinkButton;
