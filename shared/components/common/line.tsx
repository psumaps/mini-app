import React from "react";

function Line(props: React.HTMLAttributes<HTMLHRElement>) {
  const { className, ...rest } = props;
  return (
    <hr
      className={`border-solid border rounded-sm w-full ${className}`}
      {...rest}
    />
  );
}

export default Line;
