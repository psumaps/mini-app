import React from "react";
import { Icon } from "../Icon/Icon";
import type { IconType } from "../Icon/IconType";
import "./buttonIcon.css";

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
  const mode = isContrast ? "button--dark" : "button--light";
  return (
    <button className={["icon-button ", mode, typeIcon].join(" ")} {...props}>
      <Icon type={typeIcon} isContrastIcon={isContrast} />
    </button>
  );
};
