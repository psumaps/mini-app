import React from 'react';
import Layout from 'psumaps-shared/src/components/common/layout';

import EventCard from 'psumaps-shared/src/components/timetable/eventCard';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import httpClient from 'psumaps-shared/src/network/httpClient';
import HeaderBar from '~/widgets/headerBar';
import NavigationBar from '~/widgets/navigationBar';

/* eslint-disable no-nested-ternary */

const EventDescription = () => {
  const params = useParams();

  const query = useQuery({
    queryKey: ['event', Number(params.eventId)],
    queryFn: async () =>
      httpClient.psuTools.events.getEvent(Number(params.eventId)),
  });
  return (
    <>
      <Layout>
        <HeaderBar pageName="Мероприятие" />
        {query.isPending ? (
          <p>Загрузка...</p>
        ) : query.isError ? (
          <p>Ошибка!</p>
        ) : query.data.title ? (
          <EventCard event={query.data} />
        ) : (
          <p>Событие не найдено</p>
        )}
      </Layout>
      <NavigationBar />
    </>
  );
};

export default EventDescription;
