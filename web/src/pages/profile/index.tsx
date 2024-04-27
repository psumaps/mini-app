import React from 'react';
import HeaderBar from "~/widgets/header-bar";
import Layout from "~/shared/ui/layout";
import NavigationBar from "~/widgets/navigation-bar";
import 'maplibre-gl/dist/maplibre-gl.css';
import UserCard from "~/widgets/user-card";
import EtisCard from "~/widgets/etis-card";

function ProfilePage() {
    return (
        <>
            <HeaderBar pageName={"Профиль"} />
            <Layout>
                <UserCard/>
                <EtisCard/>
                {/*<ProfileMenu/>*/}
            </Layout>
            <NavigationBar/>
        </>
    );
}

export default ProfilePage;
