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
      className={[
        className,
        isContrast
          ? "text-c_main dark:text-cd_main bg-cd_main dark:bg-c_main stroke-c_main dark:stroke-cd_main fill-c_main dark:fill-cd_main"
          : "text-cd_main dark:text-c_main bg-c_main dark:bg-cd_main stroke-cd_main dark:stroke-c_main fill-cd_main dark:fill-c_main",
        "flex justify-center items-center",
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
};
