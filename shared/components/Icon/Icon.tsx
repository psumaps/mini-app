import React from "react";
import type { IconType } from "./IconType";
import { iconTypes } from "./IconType";

const getIcon = (type: string) => iconTypes.get(type);

interface Props {
  isContrastIcon?: boolean;
  type: IconType;
}

export const Icon = ({ isContrastIcon, type }: Props) => {
  const mode = isContrastIcon;
  return <div> {getIcon(type)}</div>;
};
