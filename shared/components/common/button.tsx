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
          ? "text-c_bg dark:text-cd_bg bg-c_main dark:bg-cd_main stroke-c_bg dark:stroke-cd_bg fill-c_bg dark:fill-cd_bg"
          : "text-c_main dark:text-cd_main bg-c_bg dark:bg-cd_bg stroke-c_main dark:stroke-cd_main fill-c_main dark:fill-cd_main"
      } flex justify-center items-center`}
      {...rest}
    >
      {children}
    </button>
  );
};
