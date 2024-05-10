import React, { useRef, useState } from "react";
import {
  monthRangeBackward,
  monthRangeForward,
  sliceMonths,
} from "./calendarUtils";

const CalendarDropdown = ({
  date,
  onSelect,
}: {
  date: Date;
  onSelect: (month: number, year: number) => void;
}) => {
  const dropdownTargetRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const toggleDropdown = () => {
    if (isOpen) {
      setIsOpen(!isOpen);
      return;
    }

    setIsOpen(!isOpen);
    const { top, left, width, height } =
      dropdownTargetRef.current?.getBoundingClientRect()!;
    setTop(top);
    setLeft(left);
    setWidth(width);
    setHeight(height);
  };

  return (
    <div>
      <button
        type="button"
        // @ts-expect-error button doesn't like ref attr
        ref={dropdownTargetRef}
        className="text-center flex flex-row gap-1 items-center"
        onClick={toggleDropdown}
      >
        <h5 className="c3 [text-transform:capitalize]">
          {`${date.getFullYear()} ${date.toLocaleDateString("ru-RU", { month: "long" })}`}
        </h5>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          className="w-3 h-3 stroke-c_main dark:stroke-cd_main"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          className="absolute top-0 left-0 right-0 bottom-0 z-10"
          onClick={toggleDropdown}
        >
          <div
            className="relative -translate-x-1/2 w-fit"
            style={{ top: top + height, left: left + width / 2 }}
          >
            <div className="flex flex-col bg-c_bg dark:bg-cd_bg [--tw-bg-opacity:0.25_!important] backdrop-blur-xl rounded-xl border border-solid border-c_border dark:border-cd_border">
              <h4
                className="b2 py-3 px-5 rounded-t-xl"
                onClick={(e) => e.stopPropagation()}
              >
                Выберите месяц
              </h4>
              {sliceMonths(date).map(({ name, index, year }, i) => (
                <button
                  className={`py-[0.3rem] px-2 border border-solid border-transparent border-t-c_border-secondary dark:border-t-cd_border-secondary  
                      ${
                        date.getMonth() - monthRangeBackward + i <
                        date.getMonth() + monthRangeForward
                          ? ""
                          : "rounded-b-xl"
                      }`}
                  type="button"
                  onClick={() => onSelect(index, year)}
                  key={i}
                >
                  <p
                    className={`b2 ${date.getMonth() === index && "relative after:content-[''] after:size-[0.4rem] after:bg-c_accent after:rounded-full after:absolute after:right-2 after:bottom-[50%] after:translate-y-[50%]"}`}
                  >
                    {name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDropdown;
