import React from "react";
import '../icon.css'
interface Props {
  isContrastIconFiltr?: boolean;
  }

export const IconFiltr = ({isContrastIconFiltr}: Props) => {   
  const mode = isContrastIconFiltr
  ? "dark"
  : "light";
  return (
    <svg className={mode} id="Layer_1" width="15" height="15" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" transform="rotate(90)"><path d="m108.35 285.877v-269.877a16 16 0 0 0 -32 0v269.877a71.171 71.171 0 0 0 0 138.734v71.389a16 16 0 0 0 32 0v-71.389a71.171 71.171 0 0 0 0-138.734zm-16 108.566a39.2 39.2 0 1 1 39.247-39.2 39.268 39.268 0 0 1 -39.247 39.2zm179.65-307.054v-71.389a16 16 0 0 0 -32 0v71.389a71.171 71.171 0 0 0 0 138.734v269.877a16 16 0 0 0 32 0v-269.877a71.171 71.171 0 0 0 0-138.734zm-16 108.567a39.2 39.2 0 1 1 39.247-39.2 39.268 39.268 0 0 1 -39.247 39.2zm234.9 159.288a71.318 71.318 0 0 0 -55.247-69.367v-269.877a16 16 0 0 0 -32 0v269.877a71.171 71.171 0 0 0 0 138.734v71.389a16 16 0 0 0 32 0v-71.389a71.319 71.319 0 0 0 55.247-69.367zm-71.247 39.2a39.2 39.2 0 1 1 39.247-39.2 39.268 39.268 0 0 1 -39.25 39.199z"/></svg>
  );
  };