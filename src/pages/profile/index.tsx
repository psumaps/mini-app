import React from 'react';
import Map, {GeolocateControl, NavigationControl, Source, useControl} from 'react-map-gl/maplibre';
import type {MapContextValue} from "react-map-gl/dist/esm/components/map";
import HeaderBar from "~/widgets/header-bar";
import Layout from "~/shared/ui/layout";
import NavigationBar from "~/widgets/navigation-bar";
import 'maplibre-gl/dist/maplibre-gl.css';
import IndoorEqual from "~/mapbox-gl-indoorequal/indoorEqual.ts";

const IndoorControl = () => {
    useControl((context: MapContextValue) => new IndoorEqual(context.map.getMap(), {url: "https://tiles.ijo42.ru/"}), {position:"top-right"})
    return null;
};
function ProfilePage() {
    return (
        <>
            <HeaderBar />
            <Layout>
                {/*<UserCard/>
                <ProfileMenu/>*/}
                {/*<iframe height={600} width={300} src="https://map.ijo42.ru"></iframe>*/}

    <Map
        initialViewState={{
            latitude:  58.007469,
            longitude: 56.187188,
            zoom: 14
        }}
        style={{width: 600, height: 600}}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=1XfSivF5uaaJV0EiuRS1"
    >
        <Source
            type="vector" tiles={["PBF_SERVER"]} maxzoom={14}
        />
        <GeolocateControl />
        <NavigationControl/>
        <IndoorControl />
    </Map>

            </Layout>
            <NavigationBar/>
        </>
    );
}

export default ProfilePage;
