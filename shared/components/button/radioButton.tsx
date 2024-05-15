import React, { useState } from "react";

export interface RadioButtonProps {
  name: string;
  className?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  name,
  className,
}) => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="radioButton">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={handleChange}
      />
    </div>
  );
};
