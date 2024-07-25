import React, { useMemo, useState } from 'react';
import Event from '../../../network/models/psu-tools/event';

import Block from '../../common/block';
import HeartButton from './heartButton';
import ShareButton from './shareButton';
import SignUpCard from './signupCard';
import ContactsCard from './contactsCard';
import ViewMapCard from './viewMapCard';
import RightArrowIcon from '../../../assets/right-arrow.svg?react';
import Button from '../../common/button';
import useAnimEnabled from '../../../hooks/useAnimEnabled';

const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const options: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
};

const EventCard = ({ event }: { event: Event }) => {
  const { data: animEnabled } = useAnimEnabled();
  const { eventDate, eventDay } = useMemo(() => {
    const date = new Date(event.startDatetime);
    const day = `${date.toLocaleString('ru', options)}, ${days.at(date.getDay())}`;
    return { eventDay: day, eventDate: date };
  }, [event.startDatetime]);
  const [isOpen, setIsOpen] = useState(false);

  const endDate = event.endDatetime ? new Date(event.endDatetime) : null;

  return (
    <Block className="p-[0_!important] z-[0_!important] rounded-t-[2rem]">
      <div className="flex flex-col w-full">
        <div className="flex relative flex-col ">
          <img
            loading="lazy"
            src={event.cover}
            className="object-cover w-full aspect-video max-h-[35vh] rounded-t-[2rem]"
            alt=""
          />

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

          <div className="flex py-2 flex-wrap">
            {event.tags.map((tag, i) => (
              <div
                key={tag}
                style={{
                  transitionDelay: `${isOpen ? (i - 1) * 200 : (event.tags.length - i) * 200}ms`,
                  maxWidth:
                    // eslint-disable-next-line no-nested-ternary
                    i > 0
                      ? isOpen
                        ? `${tag.length * 10 + 40}px`
                        : '0px'
                      : '100%',
                }}
                className={`py-1.5 px-4 text-center rounded-full h-fit max-h-8 border-2 border-c_main dark:border-cd_main border-solid m-1 ${
                  !isOpen && i > 0
                    ? 'max-w-[1px] p-[0_!important] m-[0_!important] border-[0_!important] opacity-0'
                    : 'opacity-100 w-fit max-w-60'
                } ${animEnabled ? 'transition-all duration-200 ease-in-out' : ''}`}
              >
                <p className="c3">{tag}</p>
              </div>
            ))}
            <Button
              className="px-3"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
            >
              <RightArrowIcon
                className={`fill-c_main dark:fill-cd_main ${isOpen ? 'rotate-180' : 'rotate-0'} ${
                  animEnabled ? 'transition-all duration-300 ease-in-out' : ''
                }`}
              />
            </Button>
          </div>

          <h1>{event.name}</h1>
          {endDate ? (
            <div className="mt-3">
              <span className="b4 font-bold">
                {eventDate.toLocaleTimeString('ru').slice(0, -3)}{' '}
              </span>
              <span className="b4 text-base font-bold text-zinc-500">
                - {endDate.toLocaleTimeString('ru').slice(0, -3)}
              </span>
            </div>
          ) : (
            <div className="mt-3">
              <h2>
                Начало: {eventDate.toLocaleTimeString('ru').slice(0, -3)}{' '}
              </h2>
            </div>
          )}

          <h4>{eventDay}</h4>
          {event.place.name && (
            <h3 className="mt-4 leading-4">
              Место:<span className="c1"> {event.place.name}</span>
            </h3>
          )}
          <h3 className="mt-2">
            {/* todo: calc status */}
            Статус:{' '}
            <span className="text-c_secondary dark:text-cd_secondary">
              Ожидание
            </span>
          </h3>

          {event.registrationUrl && <SignUpCard link={event.registrationUrl} />}
          {event.registrationUrl && (
            <ViewMapCard link={event.registrationUrl} />
          )}
          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
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
          {event.organizers[0] && (
            <>
              <h2 className="mt-7">Контакты:</h2>
              <h3 className="mt-1">Организаторы/ спикеры</h3>
              {event.organizers.map((org) => (
                <ContactsCard key={org.id} organizer={org} />
              ))}
            </>
          )}
        </div>
      </div>
    </Block>
  );
};

export default EventCard;
