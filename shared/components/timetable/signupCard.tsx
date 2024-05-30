import React from "react";
import Button from "../common/button";

function SignUpCard(props: any) {
    if (!props.link) return <div className="mt-7"/>;
        return  (
            <Button className="mt-7 rounded-3xl items-center justify-center flex h-12 w-full my-4"
                    onClick={() =>
                        window.open(props.link, '_blank')
                    }
                    isContrast={true}>
                <div className="text-xs font-bold">Записаться</div>
            </Button>
        );
}

export default SignUpCard;
