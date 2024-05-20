import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isContrast?: boolean;
  accept?: string;
  type?: "submit" | "reset" | "button";
}
export const Button = (props: ButtonProps) => {
  const { isContrast = false, className, children, ...rest } = props;
  return (
    <button
      className={`${className} ${
        isContrast
          ? "text-c_bg-block dark:text-cd_bg-block bg-c_main dark:bg-cd_main stroke-c_bg-block dark:stroke-cd_bg-block fill-c_bg-block dark:fill-cd_bg-block"
          : "text-c_main dark:text-cd_main bg-c_bg-block dark:bg-cd_bg-block stroke-c_main dark:stroke-cd_main fill-c_main dark:fill-cd_main"
      } flex justify-center items-center`}
      {...rest}
    >
      {children}
    </button>
  );
};
