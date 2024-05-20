import React, {useState} from "react";
import HeartIcon from '../../assets/heart.svg?react';


const HeartButton = (props: { person: any; }) => {
    const [person, setPerson] = useState(props.person)
    return (
        <button
            className="w-[53px] h-[53px] shrink-0 aspect-square"
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

        </button>
    )
}


export default HeartButton;
