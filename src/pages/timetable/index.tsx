import React from 'react';
import HeaderBar from "~/widgets/header-bar";
import Layout from "~/shared/ui/layout";
import NavigationBar from "~/widgets/navigation-bar";
import 'maplibre-gl/dist/maplibre-gl.css';
import ProfileMenu from "~/widgets/profile-menu";

function Timetable() {
    return (
        <>
            <HeaderBar pageName={"Расписание"} />
            <Layout>
                {/*<UserCard/>*/}
                <ProfileMenu/>
            </Layout>
            <NavigationBar/>
        </>
    );
}

export default Timetable;
