import React from 'react';

export interface InputProps {
  onClear?: () => void;
}

const Input = (
  props: React.InputHTMLAttributes<HTMLInputElement> &
    React.RefAttributes<HTMLInputElement> &
    InputProps,
) => {
  // eslint-disable-next-line react/prop-types
  const { className, value, ...rest } = props;
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <input
        value={value}
        className={`w-full p-2 border border-solid rounded-full text-c_main dark:text-cd_main border-c_secondary dark:border-cd_secondary bg-c_bg-block dark:bg-cd_bg-block focus-visible:outline-none ${className}`}
        {...rest}
      />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (props.onClear) props.onClear();
        }}
        className={`absolute top-1/2 -translate-y-1/2 size-5 transition-all duration-200 ease-in-out
          ${value !== '' ? 'opacity-100 right-6' : 'opacity-0 right-0'}`}
        title="Очистить поиск"
      >
        <div className="w-full h-[1px] origin-center rotate-45 bg-c_secondary dark:bg-cd_secondary" />
        <div className="w-full h-[1px] origin-center -rotate-45 bg-c_secondary dark:bg-cd_secondary" />
      </button>
    </>
  );
};

export default Input;
