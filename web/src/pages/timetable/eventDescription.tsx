import React, { useContext } from 'react';
import Layout from 'psumaps-shared/src/components/common/layout';

import EventCard from 'psumaps-shared/src/components/timetable/eventCard';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import httpClient from 'psumaps-shared/src/network/httpClient';
import { NavigatorContext } from 'psumaps-shared/src/models/navigator';
import UTurnLeftIcon from 'psumaps-shared/src/assets/uturn-left.svg?react';
import Button from 'psumaps-shared/src/components/common/button';
import NavigationBar from '~/widgets/navigationBar';
import HeaderBar from '~/widgets/headerBar';

/* eslint-disable no-nested-ternary */

const EventDescription = () => {
  const params = useParams();
  const navigator = useContext(NavigatorContext);

  const query = useQuery({
    queryKey: ['event', Number(params.eventId)],
    queryFn: async () =>
      httpClient.psuTools.events.getEvent(Number(params.eventId)),
  });
  return (
    <>
      <Layout>
        <div className="justify-center relative">
          <Button
            variant="primary"
            onClick={() => navigator?.back()}
            className="size-10 absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full"
          >
            <UTurnLeftIcon className="stroke-c_main dark:stroke-cd_main" />
          </Button>
          <HeaderBar pageName="Мероприятие" />
        </div>

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
