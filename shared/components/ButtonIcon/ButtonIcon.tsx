import React from "react";
import { Icon } from "../Icon/icon";
import type { IconType } from "../Icon/iconType";

interface Props {
  className?: string;
  onClick?: () => void;
  isContrast?: boolean;
  typeIcon: IconType;
}

export const ButtonIcon = ({
  className,
  onClick,
  isContrast = false,
  typeIcon,
  ...props
}: Props) => {
  return (
    <button
      className={[
        "flex justify-center items-center h-10 w-10 rounded-forty ",
        `${isContrast ? "stroke-c_main fill-c_main bg-cd_main" : " stroke-cd_main fill-cd_main bg-c_main"}`,
        typeIcon,
      ].join(" ")}
      {...props}
    >
      <Icon type={typeIcon} />
    </button>
  );
};
