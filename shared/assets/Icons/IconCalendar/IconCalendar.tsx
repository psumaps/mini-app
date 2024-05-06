import React from "react";
import '../icon.css'
interface Props {
  isContrastIconCalendar?: boolean;
  }

export const IconCalendar = ({isContrastIconCalendar}: Props) => {   
  const mode = isContrastIconCalendar
  ? "dark"
  : "light";
  return (
    <svg width= "16" height="18" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g id="_04" data-name="04">
        <path d="m27 5h-4v-2a1 1 0 0 0 -2 0v2h-10v-2a1 1 0 0 0 -2 0v2h-4a3 3 0 0 0 -3 3v19a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3v-19a3 3 0 0 0 -3-3zm0 23h-22a1 1 0 0 1 -1-1v-13h19a1 1 0 0 0 0-2h-19v-4a1 1 0 0 1 1-1h4v2a1 1 0 0 0 2 0v-2h10v2a1 1 0 0 0 2 0v-2h4a1 1 0 0 1 1 1v4h-2a1 1 0 0 0 0 2h2v13a1 1 0 0 1 -1 1z"/>
        </g>
    </svg>
      );
  };