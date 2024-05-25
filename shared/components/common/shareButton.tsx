import React from "react";
import LinkIcon from '../../assets/link.svg?react';
import bridge from "@vkontakte/vk-bridge";
import Button from "./button";

const ShareButton = (props: { id: any; }) => {
    return (
        <Button
            className={`h-10 w-10 rounded-full hover:scale-110`}
            onClick={() => {
                bridge.send('VKWebAppShare', {
                    link: "https://vk.com/app/" + props.id + "?"
                })
                    .then((data) => {
                        if (data) {
                            // Запись размещена, история опубликована, сообщение отправлено
                        }
                    })
                    .catch((error) => {
                        // Ошибка
                        console.log(error);
                    });
            }}
        >
            <LinkIcon className="stroke-0 fill-c_main dark:fill-cd_main"/>

        </Button>
    )
}


export default ShareButton;
