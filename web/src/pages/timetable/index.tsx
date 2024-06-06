import React from 'react';
// import Layout from 'psumaps-shared/src/components/common/layout';
import HeaderBar from '~/widgets/headerBar';
import NavigationBar from '~/widgets/navigationBar';
import 'maplibre-gl/dist/maplibre-gl.css';

const Timetable = () => {
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
};

export default Timetable;
