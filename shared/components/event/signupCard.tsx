import React from "react";
import Button from "../common/button";

function SignUpCard(props: any) {
    if (props.link) {
        return  (
            <Button className="mt-7 rounded-3xl items-center justify-center flex h-12 w-full my-4"
                    onClick={() =>
                        window.open(props.link, '_blank')
                    }
                    isContrast={true}>
                <p className="text-c_bg dark:text-cd_bg text-xs font-bold">Записаться</p>

            </Button>
        );
    } else {
        return (
            <div className="mt-7">

            </div>
        );
    }
}

export default SignUpCard;
