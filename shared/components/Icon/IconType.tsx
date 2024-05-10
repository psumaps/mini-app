/// <reference types="vite-plugin-svgr/client" />
import CalendarIcon from "../../assets/Icons/calendar.svg?react";
import FilterIcon from "../../assets/Icons/filter.svg?react";
import QRIcon from "../../assets/Icons/qr.svg?react";
import SearchIcon from "../../assets/Icons/search.svg?react";
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
