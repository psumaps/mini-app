/// <reference types="vite-plugin-svgr/client" />
import React from 'react';
import ArrowRight from '../../../assets/right-arrow.svg?react';
import useAnimEnabled from '../../../hooks/useAnimEnabled';
import Poi, { translateOpeningHours } from '../../../network/models/mapi/poi';
import Line from '../../common/line';

const PoiInfoDetails = ({
  item,
  className,
}: {
  item: Poi | null;
  className?: string;
}) => {
  const [opened, setOpened] = React.useState(false);
  const { data: animEnabled } = useAnimEnabled();

  let hoursTag = item?.properties.tags.opening_hours;
  if (!hoursTag) return <div />;
  hoursTag = translateOpeningHours(hoursTag);
  return (
    <div className={`${className}`}>
      <Line className="dark:border-cd_border-secondary" />
      <div className="flex flex-row justify-between items-center mx-auto py-2">
        <p className="b1 pl-4">Время работы</p>
        <button type="button" onClick={() => setOpened(!opened)}>
          <ArrowRight
            className={`fill-c_main dark:fill-cd_main size-8 p-2 mr-2 ${
              animEnabled ? 'transition-all duration-200 ease-in-out' : ''
            } ${opened ? '-rotate-90' : 'rotate-90'}`}
          />
        </button>
      </div>
      <Line className="dark:border-cd_border-secondary" />
      <div
        className={`origin-top ${
          animEnabled ? 'transition-all duration-200 ease-in-out' : ''
        } ${opened ? '' : 'opacity-0 h-0'}`}
      >
        {hoursTag.split(';').map((interval) => {
          // eslint-disable-next-line prefer-const
          let [day, time] = interval.trim().split(' ');
          if (day.includes(',')) day = day.replace(',', ', ');
          return (
            <div key={day}>
              <div className="flex flex-row justify-between px-4 items-center mx-auto py-2">
                <p className="c2">{day}</p>
                <h3 className="text-c_accent font-semibold">{time}</h3>
              </div>
              <Line className="dark:border-cd_border-secondary" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PoiInfoDetails;
