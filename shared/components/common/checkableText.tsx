import React, { useState, useMemo } from "react";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  classNameLabel?: string;
}

const CheckableText = (props: CheckboxProps) => {
  const {
    name,
    label,
    classNameLabel = "c3  text-[0.688rem] rounded-2xl px-4 py-[0.469rem] leading-[0.838rem]",
    id = useMemo(() => `${name}_${(Math.random() * 100).toFixed(0)}`, [name]),
    ...rest
  } = props;
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={isChecked}
        className="hidden"
        name={name}
        id={id}
        {...rest}
      />
      <label
        htmlFor={id}
        onClick={handleCheckboxChange}
        className={` ${classNameLabel}  ${isChecked ? "bg-c_accent border-c_accent border-2 text-cd_textHeader" : "bg-transparent border-2 border-c_secondary text-c_secondary"}`}
      >
        {label}
      </label>
    </div>
  );
};
export default CheckableText;
