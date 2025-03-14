import * as React from "react"

import { cn } from "@/lib/utils"

const AuthInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "bg-white sm:mr-3 md:mr-5 mb-3 sm:mb-0 px-4 py-2 rounded-md w-full text-black text-center",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
AuthInput.displayName = "Input"

export { AuthInput }
