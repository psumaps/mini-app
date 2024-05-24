import React, { useMemo } from "react";
import { Event } from "../../models/event";

import Block from "../common/block";
import HeartButton from "../common/heartButton";
import ShareButton from "../common/shareButton";
import SignUpCard from "./signupCard";
import ViewMapCard from "./viewMapCard";
import DetailsCard from "./detailsCard";
import ContactsCard from "./contactsCard";
const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const options = {
    month: "long",
    day: "numeric",
    timezone: "UTC",
};

function EventCard() {
  const event: Event = useMemo(
    () => ({
      organizer: "PSU-TOOLS TEAM",
      title: "Малая весна ПГНИУ",
      registration_close_datetime: undefined,
      registration_link: "https://github.com/PSUMaps",
      map_link: "https://github.com/PSUMaps",
      cover_image:
        "https://res.cloudinary.com/practicaldev/image/fetch/s--xG1gcsyJ--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/h68x0up43hmknl5tjcww.jpg",
      description:
        "Присоединяйтесь к нам и прославите яркую энергию весны на нашем ежегодном университетском концерте «Малая весна». Целью этого мероприятия",
      id: 106,
      tag: "Технологии и инновации",
      event_date: new Date("2023-09-14T16:00:00"),
      location: "Большой зал СДК ПГНИУ, 7 корп.",
      number_on_site: undefined,
      event_images: undefined,
    }),

    [],
  );


  return (
    <Block className={"p-[0_!important]"}>
      <div className="flex flex-col w-full">
        <div className="flex relative flex-col w-full aspect-[2.13] ">
          <div className="flex flex-col relative font-bold   ">
            <img
              loading="lazy"
              src={event.cover_image}
              className="object-cover size-full rounded-t-lg"
            />
            <div className="justify-center absolute bottom-4 left-4 py-2 px-4 w-fit max-w-[50%] font-bold rounded-2xl border-2 border-white border-solid">
              <p className="c3 text-white text-center text-wrap">{event.tag}</p>
            </div>
            <div className="absolute bottom-0 flex gap-3 right-0 mr-3 translate-y-1/2">
              <HeartButton person={false} />
              <ShareButton id={event.id} />
            </div>
          </div>
        </div>

        <div className="flex flex-col px-4 mt-4">
          {/* <div className="flex gap-3 self-start text-sm text-center"> */}
          {/*   <WatchIcon/> */}
          {/*   <div className="my-auto ">2 ч. 30 м.</div> */}
          {/* </div> */}

          <h1 >{event.title}</h1>
          <div className="mt-3">
            <h2>
              Начало: {event.event_date.toLocaleTimeString().slice(0, -3)}{" "}
            </h2>
            {/* <span className="text-base text-zinc-500">- 19:30</span> */}
          </div>
          <h4 className="text-zinc-500">
            {event.event_date.toLocaleString("ru", options) +
              ", " +
              days[event.event_date.getDay()]}
          </h4>
          <p className="mt-4 b1 leading-4">
            Место:<span className="font-medium"> {event.location}</span>
          </p>
          <h3 className="mt-2 leading-5">
            Статус: <span className="text-zinc-500">Ожидание</span>
          </h3>

          <SignUpCard link={event.registration_link}/>
          <ViewMapCard link={event.map_link} />
          <DetailsCard link={event.registration_link} />

          <h2 className="mt-6">О мероприятии:</h2>
          <p className="mt-2.5 c1">
            {event.description}
          </p>
          <ContactsCard organizer={event.organizer} />
        </div>
      </div>
    </Block>
  );
}

export default EventCard;
