import React from 'react';
import HeaderBar from '~/widgets/headerBar';
import Layout from '~/../../shared/components/common/layout';
import NavigationBar from '~/widgets/navigationBar';
import 'maplibre-gl/dist/maplibre-gl.css';

function Timetable() {
  return (
    <>
      <HeaderBar pageName={'Расписание'} />
      <Layout>
        {/*<UserCard/>*/}
        <></>
      </Layout>
      <NavigationBar />
    </>
  );
}

export default Timetable;
