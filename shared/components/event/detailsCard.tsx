import React from "react";

function DetailsCard(props: any) {
    if (props.link) {
        return  (
    <button
      className="self-center mt-5 text-xs text-center underline text-zinc-500"
      onClick={() => {
        window.open(props.link, "_blank");
      }}
    >
      Подробности мероприятия
    </button>
        );
    } else {
        return (
            <div className="mt-3 ">

            </div>
        );
    }
}

export default DetailsCard;
