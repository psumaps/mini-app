import 'maplibre-gl/dist/maplibre-gl.css';
import React from 'react';
import EtisCard from 'psumaps-frontend/shared/components/profile/etisCard';
import UserCard from 'psumaps-frontend/shared/components/profile/userCard';
import Layout from 'psumaps-frontend/shared/components/common/layout';
import ThemeSwitch from 'psumaps-frontend/shared/components/common/themeSwitch';
import HeaderBar from '~/widgets/headerBar';
import NavigationBar from '~/widgets/navigationBar';
import Storage from '~/app/storage';

function ProfilePage() {
  return (
    <div className="h-[92vh]">
      {/* nav is 8vh */}
      <HeaderBar pageName="Профиль" />
      <Layout>
        <UserCard />
        <EtisCard />
        <div className="flex flex-row px-4 justify-between items-center mt-8">
          <h3>Темная тема</h3>
          <ThemeSwitch storage={new Storage()} />
        </div>
      </Layout>
      <NavigationBar />
    </div>
  );
}

export default ProfilePage;
