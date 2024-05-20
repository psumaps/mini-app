import React, {useState} from "react";
import HeartIcon from '../../assets/heart.svg?react';
import Button from "./button";


const HeartButton = (props: { person: any; }) => {
    const [person, setPerson] = useState(props.person)
    return (
        <Button
            className={`h-10 w-10 rounded-full hover:scale-110 ${person ? 'bg-red-500' : 'bg-amber-50' }`}
            onClick={() => {
                setPerson(!person)
            }}
            title={person ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
            <HeartIcon/>

        </Button>
    )
}


export default HeartButton;
