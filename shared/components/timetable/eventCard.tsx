import React from 'react';
import { Event } from '../../models/event';

import Block from '../common/block';
import HeartButton from '../common/heartButton';
import ShareButton from '../common/shareButton';
import SignUpCard from './signupCard';
import ViewMapCard from './viewMapCard';
import DetailsCard from './detailsCard';
import ContactsCard from './contactsCard';

const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const options: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
};

const EventCard = ({ event }: { event: Event }) => {
  return (
    <Block className="p-[0_!important]">
      <div className="flex flex-col w-full">
        <div className="flex relative flex-col w-full aspect-[2.13] ">
          <div className="flex flex-col relative">
            <img
              loading="lazy"
              src={event.cover_image}
              className="object-cover h-40 rounded-t-lg"
              alt=""
            />
            {event.tag && (
              <div className="justify-center absolute bottom-4 left-4 py-2 px-4 w-fit max-w-[50%] font-bold rounded-2xl border-2 border-white border-solid">
                <p className="c3 text-white text-center text-wrap">
                  {event.tag}
                </p>
              </div>
            )}

            <div className="absolute bottom-0 flex gap-3 right-0 mr-3 translate-y-1/2">
              <HeartButton person={false} />
              <ShareButton id={event.id} />
            </div>
          </div>
        </div>

        <div className="flex flex-col px-4 mt-4">
          {/* <div className="flex gap-3 self-start c1 text-center"> */}
          {/*  <WatchIcon/> */}
          {/*  <div className="my-auto ">2 ч. 30 м.</div> */}
          {/* </div> */}

          <h1>{event.title}</h1>
          <div className="mt-3">
            <h2>
              Начало: {event.event_date.toLocaleTimeString('ru').slice(0, -3)}{' '}
            </h2>
            {/* <span className="text-base text-zinc-500">- 19:30</span> */}
          </div>
          <h4>
            {`${event.event_date.toLocaleString('ru', options)}, ${
              days[event.event_date.getDay()]
            }`}
          </h4>
          <h3 className="mt-4 leading-4">
            Место:<span className="c1"> {event.location}</span>
          </h3>
          <h3 className="mt-2">
            Статус:{' '}
            <span className="text-c_secondary dark:text-cd_secondary">
              Ожидание
            </span>
          </h3>

          <SignUpCard link={event.registration_link} />
          {event.map_link && <ViewMapCard link={event.map_link} />}
          <DetailsCard link={event.registration_link} />

          <h2 className="mt-6">О мероприятии:</h2>
          <p className="mt-2.5 c1">{event.description}</p>
          <ContactsCard organizer={event.organizer} />
        </div>
      </div>
    </Block>
  );
};

export default EventCard;
