import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "~/dev";
import bridge from "@vkontakte/vk-bridge";

bridge.send('VKWebAppGetUserInfo', {});
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
        >
        <App/>
        </DevSupport>
    </React.StrictMode>,
)
