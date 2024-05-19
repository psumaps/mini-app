import React, { useState } from "react";

export interface CheckBoxButtonProps {
  name: string;
  onClick: () => void;
}

export const CheckBoxButton = (
  props: React.InputHTMLAttributes<HTMLButtonElement> & CheckBoxButtonProps
) => {
  const { name, onClick } = props;
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked(!checked);
    onClick();
  };

  return (
    <div className="flex items-center pb-0.5 ">
      <button
        className="flex items-center justify-center w-3.5 h-3.5 rounded border-2 border-c_accent focus:outline-none"
        onClick={handleClick}
      >
        <span
          className={`block w-2 h-2 rounded ${
            checked ? "bg-c_accent" : "bg-transparent"
          } transform transition-transform duration-200 ease-in-out`}
        >
          {checked && (
            <span className="absolute block w-full h-full rounded-sm bg-c_accent"></span>
          )}
        </span>
      </button>
    </div>
  );
};
