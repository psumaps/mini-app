import React from "react";
import Button from "../common/button";

function DetailsCard(props: any) {
    if (props.link) {
        return  (
    <Button
      className="mt-5 c3 underline text-zinc-500 dark:text-zinc-500"
      onClick={() => {
        window.open(props.link, "_blank");
      }}
    >
      Подробности мероприятия
    </Button>
        );
    } else {
        return (
            <div className="mt-3">
            </div>
        );
    }
}

export default DetailsCard;
