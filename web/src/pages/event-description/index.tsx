import React from 'react';
import HeaderBar from '~/widgets/headerBar';
import Layout from '~/../../shared/components/common/layout';
import NavigationBar from '~/widgets/navigationBar';
import EventCard from '../../../../shared/components/event/eventCard.tsx';

function EventDescription() {
  return (
    <>
      <HeaderBar pageName={'Мероприятие'} />
      <Layout>
        <EventCard/>


    </Layout>
  <NavigationBar />
</>
)
  ;
}

export default EventDescription;
