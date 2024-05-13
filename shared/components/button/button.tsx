import React, { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  isContrast?: boolean;
}
export const Button = ({
  children,
  className,
  onClick,
  isContrast = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={[
        className,
        isContrast
          ? "text-c_main dark:text-cd_main bg-cd_main dark:bg-c_main stroke-c_main dark:stroke-cd_main fill-c_main dark:fill-cd_main"
          : "text-cd_main dark:text-c_main bg-c_main dark:bg-cd_main stroke-cd_main dark:stroke-c_main fill-cd_main dark:fill-c_main",
        "flex justify-center items-center",
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};
