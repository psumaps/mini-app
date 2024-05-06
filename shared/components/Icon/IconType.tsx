import { IconSearch } from "../../assets/Icons/IconSearch/IconSearch";
import { IconFiltr } from "../../assets/Icons/IconFiltr/IconFiltr";
import { IconCalendar } from "../../assets/Icons/IconCalendar/IconCalendar";
import { IconQR } from "../../assets/Icons/IconQR/IconQR";

import React from "react";
export type IconType =
| "QR"
| "Calendar"
| "Filtr"
| "Search";

export const iconTypes = new Map([
  ["QR", <IconQR key="IconQR" />],
  ["Calendar", <IconCalendar key="IconCalendar" />],
  ["Search", <IconSearch key="IconSearch" />],
  ["Filtr", <IconFiltr key="IconFiltr" />],
]);