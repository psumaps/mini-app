import React from 'react';
import useAnimEnabled from '../../hooks/useAnimEnabled';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'contrast' | 'accent';
  accept?: string;
}

const Button = (props: ButtonProps) => {
  const { data: animEnabled } = useAnimEnabled();
  const {
    variant = 'primary',
    className,
    children,
    type = 'button',
    ...rest
  } = props;

  let buttonStyles: string;

  switch (variant) {
    case 'primary':
      buttonStyles =
        'text-c_main dark:text-cd_main bg-c_bg-block dark:bg-cd_bg-block stroke-c_main dark:stroke-cd_main fill-c_main dark:fill-cd_main';
      break;
    case 'contrast':
      buttonStyles =
        'text-c_bg-block dark:text-cd_bg-block bg-c_main dark:bg-cd_main stroke-c_bg-block dark:stroke-cd_bg-block fill-c_bg-block dark:fill-cd_bg-block';
      break;
    case 'accent':
      buttonStyles =
        'text-c_bg-block bg-c_accent stroke-c_bg-block fill-c_bg-block';
      break;
    default:
  }

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={`flex justify-center items-center ${animEnabled && 'transition-transform duration-100 ease-in-out'}  scale-100 active:scale-90 
        ${buttonStyles!} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
