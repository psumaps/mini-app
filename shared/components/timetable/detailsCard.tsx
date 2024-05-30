import React from "react";
import Button from "../common/button";

function DetailsCard(props: any) {
    if (!props.link) return <div className="mt-3" />;
    return (
        <Button
            className="mt-5"
            onClick={() => {
                window.open(props.link, "_blank");
            }}
        >
            <h5 className="underline">Подробности мероприятия</h5>
        </Button>
    );
}

export default DetailsCard;
