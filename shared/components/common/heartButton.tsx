// @ts-ignore
import React, { useState } from "react";

const HeartButton = (props: { person: any; }) => {
  const [person,setPerson] = useState(props.person)
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
          <svg width="30" height="30" viewBox="-12 -15 32 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.3103 0C12.5784 0 11.0414 0.679698 10 1.84796C8.95862 0.679698 7.42155 0 5.68966 0C4.18123 0.00181461 2.7351 0.598402 1.66848 1.6589C0.601855 2.71941 0.00182508 4.15723 0 5.65701C0 11.8574 9.12155 16.8116 9.50948 17.0199C9.66023 17.1006 9.82878 17.1429 10 17.1429C10.1712 17.1429 10.3398 17.1006 10.4905 17.0199C10.8784 16.8116 20 11.8574 20 5.65701C19.9982 4.15723 19.3981 2.71941 18.3315 1.6589C17.2649 0.598402 15.8188 0.00181461 14.3103 0ZM13.8371 12.202C12.6364 13.215 11.353 14.1267 10 14.9276C8.64703 14.1267 7.36356 13.215 6.16293 12.202C4.29483 10.6086 2.06897 8.17866 2.06897 5.65701C2.06897 4.70225 2.45043 3.7866 3.12944 3.11148C3.80845 2.43637 4.72939 2.05709 5.68966 2.05709C7.22414 2.05709 8.50862 2.86279 9.04224 4.16047C9.11991 4.34965 9.25249 4.51153 9.42306 4.62549C9.59364 4.73944 9.79449 4.8003 10 4.8003C10.2055 4.8003 10.4064 4.73944 10.5769 4.62549C10.7475 4.51153 10.8801 4.34965 10.9578 4.16047C11.4914 2.86279 12.7759 2.05709 14.3103 2.05709C15.2706 2.05709 16.1915 2.43637 16.8706 3.11148C17.5496 3.7866 17.931 4.70225 17.931 5.65701C17.931 8.17866 15.7052 10.6086 13.8371 12.202Z"
              fill="#333333" />
          </svg>

        </div>
      </div>


    </button>
  )
}


export default HeartButton;
