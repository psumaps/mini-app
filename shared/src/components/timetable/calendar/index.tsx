/// <reference types="vite-plugin-svgr/client" />
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import CalendarDropdown from './calendarDropdown';
import {
  Value,
  calculateActiveDiv,
  calculateActiveDivMinified,
  calculateNowDiv,
  calculateNowDivMinified,
  classTile,
  classWeekday,
  divActiveId,
  divNowId,
  getWeek,
  weekdaysEqual,
} from './calendarUtils';
import { nodes, node } from '../../../utils/selector';
import Button from '../../common/button';
import CalendarIcon from '../../../assets/calendar.svg?react';
import ResetIcon from '../../../assets/reset.svg?react';
import useAnimEnabled from '../../../hooks/useAnimEnabled';

const CustomCalendar = ({
  className,
  onChange,
}: {
  className?: string;
  onChange?: (value: Value) => void;
}) => {
  const { data: animEnabled } = useAnimEnabled();
  const today = useMemo(() => new Date(), []);
  const [activeStartDate, setActiveStartDate] = useState(today);
  const [value, setValue] = useState<Value>(today);
  const [isMinified, setIsMinified] = useState(false);
  const [showNowDiv, setShowNowDiv] = useState(true);
  const [resetIconAnimation, setResetIconAnimation] = useState(false);

  let activeInterval: NodeJS.Timeout | null = null;
  let nowInterval: NodeJS.Timeout | null = null;

  const assignClasses = useCallback(() => {
    const weekdayElements = nodes(`.${classWeekday}`);
    weekdayElements.forEach((el) => {
      if (weekdaysEqual(el, value as Date) && isMinified)
        el.classList.add(`${classWeekday}--active-minified`);
      else el.classList.remove(`${classWeekday}--active-minified`);

      if (
        weekdaysEqual(el, today) &&
        isMinified &&
        node(`.${classTile}--showed-minified.${classTile}--now`) != null
      )
        el.classList.add(`${classWeekday}--now-minified`);
      else el.classList.remove(`${classWeekday}--now-minified`);
    });
  }, [isMinified, today, value]);

  const manageDivs = useCallback(() => {
    const tileNow = node(`.${classTile}--now`);
    const tileActive = node(`.${classTile}--active`);
    const weekdayNow = node(`.${classWeekday}--now-minified`);
    const weekdayActive = node(`.${classWeekday}--active-minified`);

    if (tileNow) {
      if (weekdayNow) {
        if (!showNowDiv) setShowNowDiv(true);
        if (nowInterval) clearInterval(nowInterval);
        calculateNowDivMinified();
      } else if (isMinified) setShowNowDiv(false);
      else {
        if (!showNowDiv) setShowNowDiv(true);
        calculateNowDiv();
      }
    } else {
      setShowNowDiv(false);
    }

    if (tileActive) {
      if (weekdayActive) {
        if (activeInterval) clearInterval(activeInterval);
        calculateActiveDivMinified();
      } else calculateActiveDiv();
    }

    if (tileActive === tileNow) setShowNowDiv(false);
  }, [activeInterval, isMinified, nowInterval, showNowDiv]);

  useEffect(() => {
    assignClasses();
    manageDivs();
  }, [value, isMinified, assignClasses, manageDivs]);

  const tileClassName = ({ date }: { date: Date }) => {
    let tileStyle = `${animEnabled && 'transition-all duration-300 ease-in-out'}`;
    if (!isMinified) return tileStyle;
    const week = getWeek(value as Date);
    const curr = new Date(date);
    curr.setSeconds(1); // 00:00:00 != 00:00:00 for some reason
    if (week[0] <= curr && week[1] >= curr)
      tileStyle += `${classTile}--showed-minified`;
    else
      tileStyle +=
        'translate-y-[-100%] opacity-0 h-[0_!important] p-[0_!important]';

    return tileStyle;
  };

  const handleChange = (newValue: Value) => {
    if (!(newValue instanceof Date)) setValue(newValue?.at(0) as Date);
    else setValue(newValue);

    if (onChange) onChange(newValue);
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
    setResetIconAnimation(true);
    setTimeout(() => setResetIconAnimation(false), 500);
  };

  const handleMinify = () => {
    const nowDiv = node(`#${divNowId}`);
    const activeDiv = node(`#${divActiveId}`);
    if (!nowDiv || !activeDiv) return;

    let nowDivFn: () => void;
    let activeDivFn: () => void;

    if (isMinified) {
      nowDivFn = calculateNowDiv;
      activeDivFn = calculateActiveDiv;
    } else {
      nowDivFn = calculateNowDivMinified;
      activeDivFn = calculateActiveDivMinified;
    }

    // .transitionDuration returns seconds
    const nowDuration =
      parseFloat(window.getComputedStyle(nowDiv).transitionDuration) * 1000;
    const activeDuration =
      parseFloat(window.getComputedStyle(activeDiv).transitionDuration) * 1000;

    setTimeout(() => clearInterval(activeInterval!), activeDuration);
    setTimeout(() => clearInterval(nowInterval!), nowDuration);
    nowInterval = setInterval(nowDivFn, 10); // 100 fps
    activeInterval = setInterval(activeDivFn, 10);
    setIsMinified(!isMinified);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[-100]">
        <div
          id={divNowId}
          className={`absolute border-2 border-solid border-c_accent rounded-full -translate-x-1/2 z-[-10] will-change-transform 
            ${animEnabled && 'ease-in-out duration-300 transition-all'} 
            ${isMinified ? 'h-20 -translate-y-5' : '-translate-y-1/2'} 
            ${showNowDiv ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          id={divActiveId}
          className={`absolute border-2 border-solid border-c_accent bg-c_accent rounded-full -translate-x-1/2  z-[-10] will-change-transform 
            ${animEnabled && 'ease-in-out duration-300 transition-all'} 
            ${isMinified ? 'h-20 -translate-y-5' : '-translate-y-1/2'}`}
        />
      </div>
      <Button
        type="button"
        onClick={handleMinify}
        className="bg-c_main dark:bg-cd_main size-10 rounded-full mx-auto shadow-xl mb-2"
        title="Свернуть календарь"
      >
        <CalendarIcon className="size-5 stroke-c_bg dark:stroke-cd_bg [stroke-width:0.005rem] fill-c_bg dark:fill-cd_bg" />
      </Button>
      <div className="flex flex-row justify-between w-[90%] mx-auto mb-1 items-center">
        <CalendarDropdown
          date={
            // возвращаем дату или первую дату периода
            activeStartDate instanceof Date
              ? activeStartDate
              : activeStartDate[0]
          }
          onSelect={handleSelect}
        />
        <button
          type="button"
          className="flex-row flex gap-2 items-center"
          onClick={handleReset}
          title="Сбросить дату"
        >
          <h5 className="c3 text-c_inactive dark:text-cd_inactive">
            {today.toLocaleDateString('ru-RU')}
          </h5>
          <ResetIcon
            className={`w-5 h-5 fill-c_inactive dark:fill-cd_inactive ${animEnabled && 'transition-transform'} ${resetIconAnimation ? 'rotate-[360deg] duration-500' : 'duration-0'}`}
          />
        </button>
      </div>
      <Calendar
        className="text-center text-c_main dark:text-cd_main"
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
