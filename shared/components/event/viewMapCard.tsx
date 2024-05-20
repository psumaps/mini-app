import React from "react";
import Button from "../common/button";

function ViewMapCard(props: any) {
    if (props.link) {
        return  (
    <Button className="bg-gray-200 dark:bg-neutral-700 rounded-3xl dark:text-cd_bg items-center justify-center flex h-12 w-full"
            onClick={() =>
                window.open(props.link, '_blank')
            }
    >
      <p className=" text-neutral-700 dark:text-c_bg text-xs font-bold">
        Посмотреть на карте
      </p>
    </Button>
        );
    }
}

export default ViewMapCard;
