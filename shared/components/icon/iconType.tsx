/// <reference types="vite-plugin-svgr/client" />
import CalendarIcon from "../../assets/icons/calendar.svg?react";
import FilterIcon from "../../assets/icons/filter.svg?react";
import QRIcon from "../../assets/icons/qr.svg?react";
import SearchIcon from "../../assets/icons/search.svg?react";
import React from "react";

export type IconType = "QR" | "Calendar" | "Filter" | "Search";
export const iconTypes = new Map([
  [
    "Search",
    <SearchIcon className="w-[0.9375rem] h-[0.9375rem]" key="SearchIcon" />,
  ],
  ["Calendar", <CalendarIcon className="w-4 h-[1.15rem]" key="CalendarIcon" />],
  [
    "Filter",
    <FilterIcon className="w-[0.9375rem] h-[0.9375rem]" key="FilterIcon" />,
  ],
  ["QR", <QRIcon className="w-5 h-5" key="QRIcon" />],
]);
