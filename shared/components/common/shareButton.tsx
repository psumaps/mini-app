import React from "react";
import LinkIcon from '../../assets/link.svg?react';
import bridge from "@vkontakte/vk-bridge";
import Button from "./button";

const ShareButton = (props: { id: any; }) => {
    return (
        <Button
            className={`h-10 w-10 rounded-full  hover:scale-110 bg-amber-50`}
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
            <LinkIcon/>

        </Button>
    )
}


export default ShareButton;
