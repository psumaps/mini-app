import 'maplibre-gl/dist/maplibre-gl.css';
import React from 'react';
import HeaderBar from '~/widgets/headerBar';
import NavigationBar from '~/widgets/navigationBar';
import SettingsCard from '~/components/settings/settingsCard.tsx';

const ProfilePage = () => {
  return (
    <div className="h-[92vh]">
      {/* nav is 8vh */}
      <HeaderBar pageName="Профиль" />
      <SettingsCard />

      <NavigationBar />
    </div>
  );
};

export default ProfilePage;
