import React, { useMemo } from "react";

export interface CheckableButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  classNameLabel?: string;
}

export const Radio = (props: CheckableButtonProps) => (
  <CheckableButton type="radio" {...props} />
);
export const Checkbox = (props: CheckableButtonProps) => (
  <CheckableButton type="checkbox" {...props} />
);

const CheckableButton = (props: CheckableButtonProps) => {
  const {
    name,
    type = "radio",
    id = useMemo(
      () => `${type}_${name}_${(Math.random() * 100).toFixed(0)}`,
      [name]
    ),
    label,
    classNameLabel = "c3",
    ...rest
  } = props;

  return (
    <div className="flex flex-row items-center gap-4">
      <div className="relative size-3.5">
        <input
          type={type}
          name={name}
          id={id}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] appearance-none size-5 p-0 focus:outline-none peer"
          {...rest}
        />
        <div className="z-[1] rounded-full border-solid border border-c_accent absolute inset-0 bg-transparent peer-checked:after:scale-100 after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:size-2/3 after:rounded-full after:scale-0 after:transition-transform after:duration-200 after:ease-in-out after:bg-c_accent"></div>
      </div>
      <label htmlFor={id} className={classNameLabel}>
        {label}
      </label>
    </div>
  );
};

export default CheckableButton;
