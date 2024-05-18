import React, { useState } from "react";

export interface RadioButtonProps {
  name: string;
}

export const RadioButton = (
  props: React.InputHTMLAttributes<HTMLButtonElement> & RadioButtonProps
) => {
  const { name } = props;
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div>
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={handleChange}
        className=" accent-c_accent w-3.5 h-3.5"
      />
    </div>
  );
};
