import React, { forwardRef, useMemo } from 'react';
import useAnimEnabled from '../../../hooks/useAnimEnabled';

export interface InputProps {
  onClear?: () => void;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  alwaysShowClear?: boolean;
}

const Input = forwardRef(function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & InputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const { data: animEnabled } = useAnimEnabled();
  // eslint-disable-next-line react/prop-types
  const { className, value, onSubmit, onClear, alwaysShowClear, ...rest } =
    props;
  const reference = useMemo(
    () => ref as React.MutableRefObject<HTMLInputElement>,
    [ref],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    reference?.current?.blur?.();
    onSubmit?.(e);
  };
  return (
    <form className={`relative ${className}`} onSubmit={handleSubmit}>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <input
        ref={ref}
        value={value}
        className="h-fit w-full px-4 py-1 border border-solid rounded-full text-c_main dark:text-cd_main border-c_secondary dark:border-cd_secondary bg-c_bg-block dark:bg-cd_bg-block focus-visible:outline-none"
        {...rest}
      />

      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={() => onClear?.()}
        className={`absolute top-1/2 -translate-y-1/2 size-5 ${animEnabled && 'transition-all duration-200 ease-in-out'}
          ${value !== '' || alwaysShowClear ? 'opacity-100 right-4' : 'opacity-0 right-0'}`}
        title="Очистить поиск"
      >
        <div className="w-full h-[1px] origin-center rotate-45 bg-c_secondary dark:bg-cd_secondary" />
        <div className="w-full h-[1px] origin-center -rotate-45 bg-c_secondary dark:bg-cd_secondary" />
      </button>
    </form>
  );
});

export default Input;
