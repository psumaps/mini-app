import React, { useMemo } from 'react';
import { Event } from "../../models/event";
//import HeartIcon from '~/../../assets/heart.svg?react';

import Block from "../common/block";
import HeartButton from '../common/heartButton';
import LinkButton from '../common/linkButton';


function EventCard() {
  const event: Event = useMemo(
    () => ({
      name: "Малая весна ПГНИУ",
      tag: "Концерт",
      status: "Ожидание",
      date: "22.05.2022",
      description: "Присоединяйтесь к нам и прославите яркую энергию весны на нашем ежегодном университетском концерте «Малая весна». Целью этого мероприятия",
      place: "Большой зал СДК ПГНИУ, 7 корп.",
      link: "https://vk.com",
      //photo: "https://i.ytimg.com/vi/jgk4G5_lxdE/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AHUBoAC4AOKAgwIABABGH8gRygrMA8=&amp;rs=AOn4CLCRnG-K3f-2RzIa8GaZFlxnUnVPrQ",
      start_time: "10:00",
      end_time: "11:00",
      person: false,
      photo: "https://cdn.builder.io/api/v1/image/assets/TEMP/0e575b494c2d52f5259d586603e5ff6a2ce262e1fd87f845be7f4030da8a58bc?apiKey=35bf9e9c9b564d7eb448254e081630e5&",


    }),
    []
  );



  return (
    <Block>
      <div className="flex flex-col py-px mt-2.5 w-full bg-white ">
        <div
          className="flex overflow-hidden relative flex-col px-px pt-2 w-full aspect-[2.13] ">
          <img
            loading="lazy"
            src={event.photo}
            className="object-cover  inset-0 size-full"
          />
          <div className="flex absolute  gap-5 justify-between items-start pt-0.5 pr-2.5 pl-5 w-full">
            <div
              className="justify-center px-4 py-2 mt-1 text-xs font-bold text-center text-white whitespace-nowrap rounded-2xl border-2 border-white border-solid">
              {event.tag}
            </div>
            <div className="flex gap-2 mt-5">

              <HeartButton person={event.person} />
              <LinkButton link={event.link} />

            </div>
          </div>
        </div>
        <div className="flex flex-col px-4 mt-5 font-bold text-zinc-500">
          <div className="flex gap-3 self-start text-sm text-center text-zinc-800">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/f641103306d84e4c62797f3e990648e9b10bfb35b260fd8e222cd1b6f9ff7cbd?apiKey=35bf9e9c9b564d7eb448254e081630e5&"
              className="shrink-0 aspect-square fill-zinc-800 w-[25px]"
            />
            <div className="my-auto">2 ч. 30 м.</div>
          </div>
          <div className="mt-3 text-xl text-zinc-800">{event.name}</div>
          <div className="mt-6 text-2xl">
            <span className="text-lg">{event.start_time}</span>{' '}
            <span className="text-base leading-5 text-zinc-500">- {event.end_time}</span>
          </div>
          <div className="mt-2.5 text-sm">{event.date}</div>
          <div className="mx-6 mt-5 text-base text-zinc-800">
            <span className="text-zinc-800">Место:</span>{' '}
            <span className="text-sm font-medium leading-4">
            {event.place}
          </span>
          </div>
          <div className="mt-3 text-base">
            Статус: <span className="text-zinc-500">{event.status}</span>
          </div>
          <div
            className="justify-center items-center px-16 py-2.5 mt-10 text-sm text-center text-white whitespace-nowrap bg-zinc-800 rounded-[50px]">
            Записаться
          </div>
          <div
            className="justify-center items-center px-16 py-2.5 mt-3.5 text-sm text-center bg-gray-200 rounded-[50px] text-neutral-700">
            Посмотреть на карте
          </div>
          <div className="self-center mt-5 text-xs text-center underline">
            Подробности мероприятия
          </div>
          <div className="mt-8 text-lg text-neutral-700">О мероприятии:</div>
          <div className="mt-5 text-base font-medium text-neutral-700">
            {event.description}
          </div>
        </div>
      </div>
    </Block>
  );
}

export default EventCard;
