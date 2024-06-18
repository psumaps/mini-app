import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { usePalette } from 'color-thief-react';
import Block from '../common/block';
import Event from '../../network/models/psu-tools/event';
import RightIcon from '../../assets/right-arrow.svg?react';

const EventListCard = ({ event }: { event: Event }) => {
  const date = new Date(event.event_date);
  const { data } = usePalette(event.cover_image!, 2, 'rgbString', {
    crossOrigin: 'anonymous',
  });
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
            <div className="justify-center py-1.5 px-4 max-w-[60%] rounded-full border-2 border-cd_main ">
              <p className="c3 text-center text-cd_main">{event.tag}</p>
            </div>
          )}

          <p className="c3 text-cd_main">{date.toLocaleDateString('ru')}</p>
        </div>
        <div className="flex justify-between gap-10 mt-4">
          <div>
            <h3 className="text-cd_main">{event.title}</h3>
            <p className="mt-2 c2 text-cd_main">{event.location}</p>
          </div>
          {/* eslint-disable-next-line react/button-has-type */}
          <button className="pr-3">
            <RightIcon className="fill-cd_main" />
          </button>
        </div>
        <div className="relative mt-6">
          <abbr className="absolute bottom-0 right-2 text-cd_main">
            Прошедшее
          </abbr>
        </div>
      </div>
    </Block>
  );
};

export default EventListCard;
