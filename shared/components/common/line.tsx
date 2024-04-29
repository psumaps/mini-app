import React from "react";

function Line({ className }: { className?: string }) {
  return (
    <hr className={`border-solid border rounded-sm w-full ${className}`} />
  );
}

export default Line;
