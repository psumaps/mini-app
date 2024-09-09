/// <reference types="vite-plugin-svgr/client" />
import { useQuery } from '@tanstack/react-query';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Calendar from 'react-calendar';
import { useSwipeable } from 'react-swipeable';
import CalendarIcon from '../../../assets/calendar.svg?react';
import ResetIcon from '../../../assets/reset.svg?react';
import useAnimEnabled from '../../../hooks/useAnimEnabled';
import useTryQueryClient from '../../../hooks/useTryQueryClient';
import { StorageContext } from '../../../models/storage';
import { node, nodes } from '../../../utils/selector';
import Block from '../../common/block';
import Button from '../../common/button';
import CalendarDropdown from './calendarDropdown';
import {
  calculateDiv,
  calculateMinifiedDiv,
  calendarId,
  classTile,
  classWeekday,
  divActiveId,
  divNowId,
  getWeek,
  minificationFrameTime,
  sliceMonths,
  Value,
  weekdaysEqual,
} from './calendarUtils';

const CALENDAR_MINIFIED_KEY = 'calendar-minified';

const calculateNowDivMinified = () =>
  calculateMinifiedDiv(divNowId, `${classWeekday}--now-minified`); // prettier-ignore
const calculateActiveDivMinified = () => calculateMinifiedDiv(divActiveId, `${classWeekday}--active-minified`); // prettier-ignore
const calculateNowDiv = () => calculateDiv(divNowId, `${classTile}--now`); // prettier-ignore
const calculateActiveDiv = () => calculateDiv(divActiveId, `${classTile}--active`); // prettier-ignore

const CustomCalendar = ({
  className,
  onChange,
}: {
  className?: string;
  onChange?: (value: Value) => void;
}) => {
  const { data: animEnabled } = useAnimEnabled();
  const today = useMemo(() => new Date(), []);
  const queryClient = useTryQueryClient();
  const storageContext = useContext(StorageContext);
  const [activeStartDate, setActiveStartDate] = useState(today);
  const [value, setValue] = useState<Value>(today);
  const [showNowDiv, setShowNowDiv] = useState(true);
  const [resetIconAnimation, setResetIconAnimation] = useState(false);

  const isMinifiedQuery = useQuery(
    {
      queryKey: ['storage', CALENDAR_MINIFIED_KEY],
      queryFn: async () => {
        const savedEntry = await storageContext?.get(CALENDAR_MINIFIED_KEY);
        return savedEntry === 'true';
      },
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
    queryClient,
  );

  const isMinified = isMinifiedQuery.data ?? false;

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

    if (tileNow !== null) {
      if (weekdayNow != null) {
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

    if (tileActive !== null) {
      if (weekdayActive !== null) {
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
    let tileStyle = `${animEnabled ? 'transition-all duration-300 ease-in-out ' : ' '}`;
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

    (newValue as Date).setHours(0, 0, 0, 0);
    onChange?.(newValue);
  };

  const handleSelect = (month: number, year: number) => {
    const newValue = new Date(value as Date);
    newValue.setMonth(month);
    newValue.setFullYear(year);
    setValue(newValue);
    onChange?.(newValue);
    setActiveStartDate(newValue);
  };

  const handleReset = () => {
    setValue(today);
    onChange?.(today);
    setActiveStartDate(today);
    setResetIconAnimation(true);
    setTimeout(() => setResetIconAnimation(false), 500);
  };

  const handleMinify = () => {
    const nowDiv = node(`#${divNowId}`);
    const activeDiv = node(`#${divActiveId}`);
    if (nowDiv === null || activeDiv === null) return;

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

    setTimeout(
      () => clearInterval(activeInterval!),
      activeDuration + minificationFrameTime,
    );
    setTimeout(
      () => clearInterval(nowInterval!),
      nowDuration + minificationFrameTime,
    );
    nowInterval = setInterval(nowDivFn, minificationFrameTime);
    activeInterval = setInterval(activeDivFn, minificationFrameTime);
    void storageContext?.set(
      CALENDAR_MINIFIED_KEY,
      isMinified ? 'false' : 'true',
    );
    void queryClient.invalidateQueries({
      predicate: (query) => query.queryKey.includes(CALENDAR_MINIFIED_KEY),
    });
  };

  const [stopScroll, setStopScroll] = useState(false);

  const handlers = useSwipeable({
    onSwipeStart: () => setStopScroll(true),
    onSwiped: (eventData) => {
      setStopScroll(false);
      const months = activeStartDate && sliceMonths(activeStartDate);
      let newMonth = 0;
      switch (eventData.dir) {
        case 'Left':
          newMonth = activeStartDate.getMonth() + 1;
          if (
            months?.some(
              (v) =>
                v.year ===
                  activeStartDate.getFullYear() + Math.floor(newMonth / 12) &&
                v.index === newMonth % 12,
            )
          )
            handleSelect(
              newMonth % 12,
              activeStartDate.getFullYear() + newMonth / 12,
            );

          break;
        case 'Right':
          newMonth = activeStartDate.getMonth() - 1;
          if (
            months?.some(
              (v) =>
                v.year ===
                  activeStartDate.getFullYear() + Math.floor(newMonth / 12) &&
                // +12 to handle year change
                v.index === (newMonth + 12) % 12,
            )
          )
            handleSelect(
              (newMonth + 12) % 12,
              activeStartDate.getFullYear() + newMonth / 12,
            );

          break;
        case 'Down':
          handleMinify();
          break;
        default:
          break;
      }
    },
  });

  return (
    <div
      {...handlers}
      style={{ touchAction: stopScroll ? 'none' : 'auto' }}
      className={`${className}`}
    >
      <Button
        type="button"
        onClick={handleMinify}
        className="bg-c_main dark:bg-cd_main size-10 rounded-full mx-auto shadow-xl -mb-6 z-10 relative disabled:bg-c_secondary dark:disabled:bg-cd_secondary"
        title="Свернуть календарь"
      >
        <CalendarIcon className="size-5 stroke-c_bg dark:stroke-cd_bg [stroke-width:0.005rem] fill-c_bg dark:fill-cd_bg" />
      </Button>
      <Block
        id={calendarId}
        className={`flex flex-col relative pt-8 will-change-auto 
          ${animEnabled && 'transition-all duration-300 ease-in-out'} 
          ${isMinified ? 'pb-6' : ''}`}
      >
        <div className="absolute top-0 left-0 right-0">
          <div
            id={divNowId}
            className={`absolute border-2 border-solid border-c_accent rounded-full -translate-x-1/2 will-change-transform
              ${animEnabled && 'ease-in-out duration-300 transition-all'} 
              ${isMinified ? '-translate-y-[1rem]' : '-translate-y-1/2'} 
              ${showNowDiv ? 'opacity-100' : 'opacity-0'}`}
          />
          <div
            id={divActiveId}
            className={`absolute border-2 border-solid border-c_accent bg-c_accent rounded-full -translate-x-1/2 will-change-transform
              ${animEnabled && 'ease-in-out duration-300 transition-all'} 
              ${isMinified ? '-translate-y-[1rem]' : '-translate-y-1/2'}`}
          />
        </div>
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
              className={`w-5 h-5 fill-c_inactive dark:fill-cd_inactive transition-transform ${resetIconAnimation ? 'rotate-[360deg] duration-500' : 'duration-0'}`}
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
      </Block>
    </div>
  );
};

export default CustomCalendar;
