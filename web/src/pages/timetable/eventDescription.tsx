import React from 'react';
import Layout from '~/../../shared/components/common/layout';
import HeaderBar from '~/widgets/headerBar';
import NavigationBar from '~/widgets/navigationBar';
import EventCard from '~/../../shared/components/event/eventCard.tsx';

const EventDescription = () => {
  return (
    <>
      <HeaderBar pageName="Мероприятие" />
      <Layout>
        <EventCard />
      </Layout>
      <NavigationBar />
    </>
  );
};

export default EventDescription;
