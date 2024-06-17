import React, { useMemo } from 'react';
import Event from '../../../network/models/psu-tools/event';

import Block from '../../common/block';
import HeartButton from './heartButton';
import ShareButton from './shareButton';
import SignUpCard from './signupCard';
import ContactsCard from './contactsCard';
import ViewMapCard from './viewMapCard';

const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const options: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
};

const EventCard = ({ event }: { event: Event }) => {
  const eventDate = useMemo(
    () => new Date(event.event_date),
    [event.event_date],
  );
  const day = useMemo(
    () =>
      `${eventDate.toLocaleString('ru', options)}, ${days.at(eventDate.getDay())}`,
    [eventDate],
  );
  return (
    <Block className="p-[0_!important] z-[0_!important] rounded-t-[2rem]">
      <div className="flex flex-col w-full">
        <div className="flex relative flex-col ">
          <img
            loading="lazy"
            src={event.cover_image}
            className="object-cover w-full aspect-video max-h-[35vh] rounded-t-[2rem]"
            alt=""
          />
          {event.tag && (
            <div className="justify-center absolute bottom-4 left-4 py-2 px-4 w-fit max-w-[50%] font-bold rounded-full border-2 border-white border-solid">
              <p className="c3 text-white text-center text-wrap">{event.tag}</p>
            </div>
          )}

          <div className="absolute bottom-0 flex gap-3 right-0 mr-3 translate-y-1/2">
            <HeartButton active={false} />
            <ShareButton id={event.id} />
          </div>
        </div>

        <div className="flex flex-col px-4 mt-4 pb-4">
          {/* <div className="flex gap-3 self-start c1 text-center"> */}
          {/*  <WatchIcon/> */}
          {/*  <div className="my-auto ">2 ч. 30 м.</div> */}
          {/* </div> */}

          <h1>{event.title}</h1>
          <div className="mt-3">
            <h2>Начало: {eventDate.toLocaleTimeString('ru').slice(0, -3)} </h2>
            {/* <span className="text-base text-zinc-500">- 19:30</span> */}
          </div>
          <h4>{day}</h4>
          {event.location && (
            <h3 className="mt-4 leading-4">
              Место:<span className="c1"> {event.location}</span>
            </h3>
          )}
          <h3 className="mt-2">
            {/* todo: calc status */}
            Статус:{' '}
            <span className="text-c_secondary dark:text-cd_secondary">
              Ожидание
            </span>
          </h3>

          {event.registration_link && (
            <SignUpCard link={event.registration_link} />
          )}
          {event.map_link && <ViewMapCard link={event.map_link} />}
          {event.registration_link && (
            <a
              href={event.registration_link}
              className="underline c3 text-c_secondary dark:text-cd_secondary mt-3 text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Подробности мероприятия
            </a>
          )}
          {event.description && (
            <>
              <h2 className="mt-6">О мероприятии:</h2>
              <p className="mt-2.5 c1">{event.description}</p>
            </>
          )}
          {event.organizer && <ContactsCard organizer={event.organizer} />}
        </div>
      </div>
    </Block>
  );
};

export default EventCard;
