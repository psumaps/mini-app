import React from "react";
import LinkIcon from '../../assets/link.svg?react';
import bridge from "@vkontakte/vk-bridge";

const ShareButton = (props: { id: any; }) => {
    return (
        <button
            className="w-[53px] h-[53px] shrink-0 aspect-square"
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


export default ShareButton;
