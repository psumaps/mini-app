import React from 'react';
import Layout from 'psumaps-shared/src/components/common/layout';

import EventCard from 'psumaps-shared/src/components/timetable/eventCard';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import httpClient from 'psumaps-shared/src/network/httpClient';
import HeaderBar from '~/widgets/headerBar';
import NavigationBar from '~/widgets/navigationBar';

const EventDescription = () => {
  const params = useParams();

  const query = useQuery({
    queryKey: ['event', Number(params.eventId)],
    queryFn: async () =>
      httpClient.psuTools.events.getEvent(Number(params.eventId)),
  });
  return (
    <div className="h-[92vh]">
      {/* nav is 8vh */}
      <HeaderBar pageName="Мероприятие" />
      <Layout>
        {query.isPending ? <div>Загрузка...</div> : <> </>}
        {query.isError ? <div>Ошибка!</div> : <> </>}
        {query.data?.title ? (
          <EventCard event={query.data} />
        ) : (
          <>Событие не найдено :(</>
        )}
      </Layout>
      <NavigationBar />
    </div>
  );
};

export default EventDescription;
