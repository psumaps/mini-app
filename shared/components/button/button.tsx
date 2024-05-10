import React, { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  isContrast?: boolean;
  styleButton?: "text-b w-28 h-8" | "h-10 w-56" | "h-10 w-10 rounded-forty";
}
export const Button = ({
  children,
  className,
  onClick,
  isContrast = false,
  styleButton = "text-b w-28 h-8",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={[
        className,
        `${isContrast ? "text-c_main dark:text-cd_main bg-cd_main dark:bg-c_main stroke-c_main dark:stroke-cd_main fill-c_main dark:fill-cd_main" : "text-cd_main dark:text-c_main bg-c_main dark:bg-cd_main stroke-cd_main dark:stroke-c_main fill-cd_main dark:fill-c_main"}`,
        `${styleButton}`,
        "flex justify-center items-center rounded-fifty p",
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};
