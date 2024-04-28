import React from 'react';
import HeaderBar from '~/widgets/header-bar';
import Layout from '~/shared/ui/layout';
import NavigationBar from '~/widgets/navigation-bar';
import 'maplibre-gl/dist/maplibre-gl.css';
import UserCard from '~/../../shared/components/profile/userCard';
import EtisCard from '~/../../shared/components/profile/etisCard';

function ProfilePage() {
  return (
    <>
      <HeaderBar pageName={'Профиль'} />
      <Layout>
        <UserCard />
        <EtisCard />
        {/*<ProfileMenu/>*/}
      </Layout>
      <NavigationBar />
    </>
  );
}

export default ProfilePage;
