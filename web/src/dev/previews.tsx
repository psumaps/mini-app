import React from "react";
import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import NavigationBar from "~/widgets/navigation-bar";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/NavigationBar">
                <NavigationBar/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;
