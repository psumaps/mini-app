import React, { useState, useMemo, useEffect } from "react";
import Calendar from "react-calendar";
import CalendarDropdown from "./calendarDropdown";
import { Value, getWeek, weekdays } from "./calendarUtils";
import { nodes } from "../../utils/selector";

const CustomCalendar = ({ className }: { className?: string }) => {
  const today = useMemo(() => new Date(), []);
  const startDate = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  }, []);
  const [activeStartDate, setActiveStartDate] = useState(startDate);
  const [value, setValue] = useState<Value>(today);
  const [isMinified, setIsMinified] = useState(false);

  useEffect(() => {
    const weekdayElements = nodes(
      ".react-calendar__month-view__weekdays__weekday"
    );
    weekdayElements.forEach((el) => {
      if (
        (el.childNodes[0] as HTMLSpanElement).getAttribute("aria-label") ===
          weekdays[((value as Date).getDay() + 6) % 7] && // getDay() returns 0 for Sunday
        isMinified
      )
        el.classList.add(
          "react-calendar__month-view__weekdays__weekday--active-minified"
        );
      else
        el.classList.remove(
          "react-calendar__month-view__weekdays__weekday--active-minified"
        );
    });
  }, [value, isMinified]);

  const tileClassName = ({ date }: { date: Date }) => {
    if (!isMinified) return "";
    const week = getWeek(value as Date)!;
    const curr = new Date(date);
    curr.setSeconds(1); // 00:00:00 != 00:00:00 for some reason
    if (week[0] <= curr && week[1] >= curr)
      return "-translate-y-[0.3rem] react-calendar__tile--showed-minified";
    return "translate-y-[-100%] opacity-0 [height:0_!important] [padding:0_!important]";
  };

  const handleChange = (value: Value) => {
    if (!(value instanceof Date)) setValue(value?.at[0]);
    else setValue(value);
  };

  const handleSelect = (month: number, year: number) => {
    const newValue = new Date(value as Date);
    newValue.setMonth(month);
    newValue.setFullYear(year);
    setValue(newValue);
    setActiveStartDate(newValue);
  };

  const handleReset = () => {
    setValue(today);
    setActiveStartDate(today);
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setIsMinified(!isMinified)}
        className="bg-c_main dark:bg-cd_main w-fit py-[calc(0.75rem_-_0.13rem)] px-[0.75rem] rounded-full mx-auto shadow-xl mb-2"
      >
        <svg
          className="w-4 h-[1.15rem] dark:fill-cd_bg-block fill-c_bg-block"
          viewBox="0 0 16 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.4 3.27273C1.95817 3.27273 1.6 3.63904 1.6 4.09091V15.5455C1.6 15.9973 1.95817 16.3636 2.4 16.3636H13.6C14.0418 16.3636 14.4 15.9973 14.4 15.5455V4.09091C14.4 3.63904 14.0418 3.27273 13.6 3.27273H2.4ZM0 4.09091C0 2.7353 1.07452 1.63636 2.4 1.63636H13.6C14.9255 1.63636 16 2.7353 16 4.09091V15.5455C16 16.9011 14.9255 18 13.6 18H2.4C1.07452 18 0 16.9011 0 15.5455V4.09091Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.2 0C11.6418 0 12 0.366312 12 0.818182V4.09091C12 4.54278 11.6418 4.90909 11.2 4.90909C10.7582 4.90909 10.4 4.54278 10.4 4.09091V0.818182C10.4 0.366312 10.7582 0 11.2 0Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.8 0C5.24183 0 5.6 0.366312 5.6 0.818182V4.09091C5.6 4.54278 5.24183 4.90909 4.8 4.90909C4.35817 4.90909 4 4.54278 4 4.09091V0.818182C4 0.366312 4.35817 0 4.8 0Z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 7.36364C0 6.91177 0.358172 6.54545 0.8 6.54545H15.2C15.6418 6.54545 16 6.91177 16 7.36364C16 7.81551 15.6418 8.18182 15.2 8.18182H0.8C0.358172 8.18182 0 7.81551 0 7.36364Z"
          />
        </svg>
      </button>
      <div className="flex flex-row justify-between px-2 mb-1 items-center">
        <CalendarDropdown
          date={
            activeStartDate! instanceof Date
              ? activeStartDate
              : activeStartDate![0]!
          }
          onSelect={handleSelect}
        />
        <button
          type="button"
          className="flex-row flex gap-2 items-center"
          onClick={handleReset}
        >
          <h5 className="c3 text-c_inactive dark:text-cd_inactive">
            {today.toLocaleDateString("ru-RU")}
          </h5>
          <svg
            className="w-4 h-4 fill-c_inactive dark:fill-cd_inactive"
            viewBox="0 0 14 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7.24129 0.241118C7.39573 0.0867302 7.60516 0 7.82353 0C8.0419 0 8.25133 0.0867302 8.40576 0.241118L10.8764 2.71171C11.0307 2.86614 11.1175 3.07557 11.1175 3.29394C11.1175 3.51231 11.0307 3.72174 10.8764 3.87618L8.40576 6.34677C8.25045 6.49678 8.04242 6.57979 7.82649 6.57791C7.61057 6.57603 7.40402 6.48942 7.25133 6.33673C7.09864 6.18404 7.01203 5.97749 7.01015 5.76157C7.00827 5.54564 7.09128 5.33761 7.24129 5.1823L8.30612 4.11747H7C4.07812 4.11747 1.64706 6.54853 1.64706 9.47041C1.64706 12.3923 4.07812 14.8234 7 14.8234C9.92188 14.8234 12.3529 12.3923 12.3529 9.47041C12.3529 9.252 12.4397 9.04253 12.5941 8.88809C12.7486 8.73365 12.9581 8.64688 13.1765 8.64688C13.3949 8.64688 13.6044 8.73365 13.7588 8.88809C13.9132 9.04253 14 9.252 14 9.47041C14 13.3015 10.8311 16.4704 7 16.4704C3.16894 16.4704 0 13.3015 0 9.47041C0 5.63935 3.16894 2.47041 7 2.47041H8.30612L7.24129 1.40559C7.08691 1.25115 7.00018 1.04172 7.00018 0.823354C7.00018 0.604983 7.08691 0.395553 7.24129 0.241118Z" />
          </svg>
        </button>
      </div>
      <Calendar
        className={`${className} text-center text-c_main dark:text-cd_main`}
        activeStartDate={activeStartDate}
        value={value}
        tileClassName={tileClassName}
        onChange={handleChange}
        showNavigation={false}
        locale="ru-RU"
      />
    </div>
  );
};

export default CustomCalendar;
