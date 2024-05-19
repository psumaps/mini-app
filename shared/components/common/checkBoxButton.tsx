import React, { useState } from "react";

export const CheckBox = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => {
  const { ...rest } = props;
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked(!checked);
  };

  return (
    <div className="pb-0.5">
      <label>
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={handleClick}
          {...rest}
        />
        <div
          className={`w-3.5 h-3.5 rounded-full border ${checked ? " border-c_accent" : "border-c_main"} focus:outline-none relative`}
        >
          {checked && (
            <div className="h-2.5 w-2.5 rounded-full bg-c_accent border-c_accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          )}
        </div>
      </label>
    </div>
  );
};
