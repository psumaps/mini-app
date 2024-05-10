import React, { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  isContrast?: boolean;
  typeButton?: "text-xs w-28 h-8" | "h-10 w-56";
}
export const ButtonText = ({
  children,
  className,
  onClick,
  isContrast = false,
  typeButton = "text-xs w-28 h-8",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={[
        `${isContrast ? "text-c_main bg-cd_main" : "text-cd_main bg-c_main"}`,
        `${typeButton}`,
        "flex justify-center items-center rounded-fifty p",
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};
