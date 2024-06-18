import React from 'react';
import Block from '../common/block';
import Event from '../../network/models/psu-tools/event';
import RightIcon from '../../assets/right-arrow.svg?react';
import Button from '../common/button';

const EventListCard = ({ event }: { event: Event }) => {
  const date = new Date(event.event_date);
  return (
    <Block className="p-[0_!important] rounded-t-[2rem]">
      <img
        loading="lazy"
        src={event.cover_image}
        className="object-cover w-full aspect-video max-h-[30vh] rounded-t-[2rem]"
        alt=""
      />
      <div className="flex flex-col px-4 mt-3 pb-4">
        <div className="flex  justify-between items-center">
          {event.tag && (
            <div className="justify-center py-1.5 px-4 max-w-[60%] rounded-full border-2 border-c_main dark:border-cd_main">
              <p className="c3 text-center">{event.tag}</p>
            </div>
          )}

          <p className="c3">{date.toLocaleDateString('ru')}</p>
        </div>
        <div className="flex justify-between gap-10 mt-4">
          <div>
            <h3>{event.title}</h3>
            <p className="mt-2 c2">{event.location}</p>
          </div>
          <Button className="pr-3">
            <RightIcon className="fill-c_main dark:fill-cd_main" />
          </Button>
        </div>
        <div className="relative mt-6">
          <abbr className="absolute bottom-0 right-2">Прошедшее</abbr>
        </div>
      </div>
    </Block>
  );
};

export default EventListCard;
