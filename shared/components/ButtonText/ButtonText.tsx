import React, { ReactNode } from "react";
import "./buttonText.css";
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;1,500&display=swap');
</style>

interface ButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  isContrast?: boolean;
  typeButton?: "status" | "search";
}
export const ButtonText = ({
  children,
  className,
  onClick,
  isContrast=false,
  typeButton = "status",
  ...props
}: ButtonProps) => {
  const mode = isContrast
    ? "text-button--dark"
    : "text-button--light";
  return (
    <button className={[mode, `text-button--${typeButton}`,"text-button"].join(" ")} {...props}>
      {children}
    </button>
  );
};
