import React, {useState} from "react";
import HeartIcon from '../../assets/heart.svg?react';
import Button from "./button";


const HeartButton = (props: { person: any; }) => {
    const [person, setPerson] = useState(props.person)
    return (
        <Button
            className="h-10 w-10 rounded-forty shrink-0 aspect-square"
            onClick={() => {
                setPerson(!person)
            }}
            title={person ? 'Удалить из избранного' : 'Добавить в избранное'}
        >

            <div
                className={` w-[40px] h-[40px] hover:scale-110`}
            >
                <div
                    className={`w-[40px] h-[40px] rounded-full  ${person ? 'bg-red-500' : 'bg-amber-50'}`}
                >
                    <HeartIcon/>
                </div>
            </div>

        </Button>
    )
}


export default HeartButton;
