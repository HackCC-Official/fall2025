import React from "react";

export function ApplicationError({ children } :  { children: React.ReactNode }) {
  return (
    <p className="mt-4 font-semibold text-red-500 text-sm">{children}</p>
  )
}