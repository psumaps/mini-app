import React, { useState, useMemo, ChangeEvent } from 'react';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  classNameLabel?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const CheckableText = (props: CheckboxProps) => {
  const {
    name,
    label,
    id,
    onChange,
    classNameLabel = 'c3  text-[0.688rem] rounded-2xl px-4 py-[0.469rem] leading-[0.838rem]',
    ...rest
  } = props;
  const [isChecked, setIsChecked] = useState(false);

  const inputId = useMemo(
    () => id || `${name}_${(Math.random() * 100).toFixed(0)}`,
    [name, id],
  );

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newCheckedState = event.target.checked;
    setIsChecked(newCheckedState);
    if (onChange) {
      onChange(event);
    }
  };

  const handleLabelClick = () => {
    const mockEvent = {
      target: {
        checked: !isChecked,
      },
    } as ChangeEvent<HTMLInputElement>;
    handleCheckboxChange(mockEvent);
  };
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={isChecked}
        className="hidden"
        name={name}
        id={inputId}
        onChange={handleCheckboxChange}
        {...rest}
      />
      <label
        htmlFor={id}
        onClick={handleLabelClick}
        className={` ${classNameLabel}  ${isChecked ? 'bg-c_accent border-c_accent border-2 text-cd_textHeader' : 'bg-transparent border-2 border-c_secondary text-c_secondary'}`}
      >
        {label}
      </label>
    </div>
  );
};
export default CheckableText;
