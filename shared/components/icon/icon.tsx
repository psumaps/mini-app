import React from "react";
import type { IconType } from "./iconType";
import { iconTypes } from "./iconType";

const getIcon = (type: string) => iconTypes.get(type);

interface Props {
  type: IconType;
  className?: string;
}

export const Icon = ({ type }: Props) => {
  return <div> {getIcon(type)}</div>;
};
