import React from 'react';
// import Layout from 'psumaps-frontend/shared/components/common/layout';
import HeaderBar from '~/widgets/headerBar';
import NavigationBar from '~/widgets/navigationBar';
import 'maplibre-gl/dist/maplibre-gl.css';

function Timetable() {
  return (
    <>
      <HeaderBar pageName="Расписание" />
      {/* <Layout>
        <UserCard/>
        <></>
      </Layout> */}
      <NavigationBar />
    </>
  );
}

export default Timetable;
