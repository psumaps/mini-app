import React, { ChangeEvent, useCallback } from 'react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  filterId: string;
  valueId: string;
  label?: string;
  isChecked?: boolean;
  classNameLabel?: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement>,
    filterId: string,
    valueId: string,
  ) => void;
}

const CheckableText = (props: CheckboxProps) => {
  const {
    filterId,
    valueId,
    name,
    label,
    id = `${filterId}-${valueId}`,
    onChange,
    isChecked = false,
    classNameLabel = ' c3  text-[0.7rem] rounded-2xl px-4 py-[0.5rem] leading-[0.8rem]',
    ...rest
  } = props;

  const handleCheckboxChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event, filterId, valueId);
    },
    [onChange, filterId, valueId],
  );

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={isChecked}
        className="hidden"
        name={name}
        id={id}
        onChange={handleCheckboxChange}
        {...rest}
      />
      <label
        htmlFor={id}
        className={`transition-colors duration-200 ease-in-out ${classNameLabel} ${
          isChecked
            ? 'bg-c_accent border-c_accent border-2 text-cd_textHeader'
            : 'bg-transparent border-2 border-c_secondary text-c_secondary'
        }`}
      >
        {label}
      </label>
    </div>
  );
};
export default CheckableText;
