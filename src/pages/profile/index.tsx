import React from 'react';

import UserCard from '~/widgets/user-card';
import Layout from '~/shared/ui/layout';
import HeaderBar from '~/widgets/header-bar';
import NavigationBar from '~/widgets/navigation-bar';
import ProfileMenu from '~/widgets/profile-menu';

function ProfilePage() {
  return (
    <>
      <HeaderBar />
      <Layout>
        <UserCard />
        <ProfileMenu />
      </Layout>
      <NavigationBar />
    </>
  );
}

export default ProfilePage;
