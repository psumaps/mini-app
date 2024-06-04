import 'maplibre-gl/dist/maplibre-gl.css';
import React from 'react';
import SettingsCard from 'psumaps-frontend/shared/components/settings/settingsCard.tsx';
import HeaderBar from '~/widgets/headerBar';
import NavigationBar from '~/widgets/navigationBar';

const SettingsPage = () => {
  return (
    <div className="h-[92vh]">
      {/* nav is 8vh */}
      <HeaderBar pageName="Настройки" />
      <SettingsCard />

      <NavigationBar />
    </div>
  );
};

export default SettingsPage;
