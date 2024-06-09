import React from 'react';
import Layout from 'psumaps-shared/src/components/common/layout';

import EventCard from 'psumaps-shared/src/components/timetable/eventCard';
import { Event } from 'psumaps-shared/src/models/event';
import useLoaderData from '~/utils/routerLoader';
import HeaderBar from '~/widgets/headerBar';
import NavigationBar from '~/widgets/navigationBar';

const EventDescription = () => {
  const event = useLoaderData<Event>();
  event.event_date = new Date(event.event_date);
  return (
    <>
      <HeaderBar pageName="Мероприятие" />
      <Layout>
        <EventCard event={event} />
      </Layout>
      <NavigationBar />
    </>
  );
};

export default EventDescription;
