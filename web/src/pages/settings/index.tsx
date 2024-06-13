import 'maplibre-gl/dist/maplibre-gl';
import React from 'react';
import Settings from 'psumaps-shared/src/components/settings';
import Layout from 'psumaps-shared/src/components/common/layout';
import UserCard from 'psumaps-shared/src/components/settings/userCard';
import HeaderBar from '~/widgets/headerBar';
import NavigationBar from '~/widgets/navigationBar';
import Storage from '~/app/storage';

const SettingsPage = () => {
  return (
    <div className="h-[92vh]">
      {/* nav is 8vh */}
      <HeaderBar pageName="Настройки" />
      <Layout>
        <UserCard />
        <Settings storage={new Storage()} />
      </Layout>
      <NavigationBar />
    </div>
  );
};

export default SettingsPage;
