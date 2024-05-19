import React from "react";

function SignUpCard(props: any) {
    if (props.link) {
        return  (
            <button className="mt-7 bg-c_main dark:bg-cd_main rounded-3xl items-center justify-center flex h-12 w-full my-4"
                    onClick={() => {
                        window.open(props.link, "_blank");
                    }}>
                <p className=" text-c_bg dark:text-cd_bg text-xs font-bold">Записаться</p>

            </button>
        );
    } else {
        return (
            <div className="mt-7 ">

            </div>
        );
    }
}

export default SignUpCard;
