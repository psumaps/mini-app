import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { usePalette } from 'color-thief-react';
import Block from '../common/block';
import Event from '../../network/models/psu-tools/event';
import RightArrowIcon from '../../assets/right-arrow.svg?react';

const EventListCard = ({
  event,
  onOpenDesc,
}: {
  event: Event;
  onOpenDesc: (id: string) => void;
}) => {
  const date = new Date(event.event_date);
  const { data } = usePalette(event.cover_image!, 2, 'rgbString', {
    crossOrigin: 'anonymous',
  });

  const canDrawGradient = data?.[0] && data?.[1];

  return (
    <Block
      className="p-[0_!important] rounded-t-[2.5rem]"
      style={{
        background: `linear-gradient(to right, ${data?.[0]}, ${data?.[1]})`,
      }}
    >
      <img
        loading="lazy"
        src={event.cover_image}
        className="object-cover w-full aspect-video max-h-[30vh] rounded-t-[2rem]"
        alt=""
      />
      <div className="flex flex-col px-4 mt-3 pb-4">
        <div className="flex justify-between items-center">
          {event.tag && (
            <div
              className={`justify-center py-1.5 px-4 max-w-[60%] rounded-full border-2 
                ${canDrawGradient ? 'border-cd_main' : 'border-c_main dark:border-cd_main'}`}
            >
              <p
                className={`c3 text-center ${canDrawGradient ? 'text-cd_main' : ''}`}
              >
                {event.tag}
              </p>
            </div>
          )}

          <p className={`c3 ${canDrawGradient ? 'text-cd_main' : ''}`}>
            {date.toLocaleDateString('ru')}
          </p>
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <h3 className={canDrawGradient ? 'text-cd_main' : ''}>
              {event.title}
            </h3>
            <p className={`mt-2 c2 ${canDrawGradient ? 'text-cd_main' : ''}`}>
              {event.location}
            </p>
          </div>
          <button
            className="pr-3 pl-10 scale-100 active:scale-90"
            type="button"
            onClick={() => onOpenDesc(`${event.id}`)}
          >
            <RightArrowIcon
              className={
                canDrawGradient
                  ? 'fill-cd_main'
                  : 'fill-c_main dark:fill-cd_main'
              }
            />
          </button>
        </div>

        <div className="relative mt-6">
          {date < new Date() && (
            <abbr
              className={`absolute bottom-0 right-2 ${canDrawGradient ? 'text-cd_main' : ''}`}
            >
              Прошедшее
            </abbr>
          )}
        </div>
      </div>
    </Block>
  );
};

export default EventListCard;
