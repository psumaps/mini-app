import React from 'react';
import HeaderBar from '~/widgets/headerBar.tsx';
import Layout from '../../../../shared/components/common/layout.tsx';
import NavigationBar from '~/widgets/navigationBar.tsx';
import EventCard from '../../../../shared/components/timetable/eventCard.tsx';

function EventDescription() {
  return (
    <>
      <HeaderBar pageName={'Мероприятие'} />
      <Layout>
        <EventCard />
      </Layout>
      <NavigationBar />
    </>
  );
}

export default EventDescription;
