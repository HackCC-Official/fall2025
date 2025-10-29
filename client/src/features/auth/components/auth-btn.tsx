import { ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface AuthButtonProps extends ButtonProps {
  isLoading: boolean;
  loadingText: string;
  text: string;
}

const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ className, isLoading, loadingText, text, ...props }, ref) => {
    return (
      <button
        className={cn([
          "bg-navyblue hover:bg-hoverpurple py-2 rounded-md w-full text-white text-center text-nowrap cursor-pointer",
          className
        ])}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
          {isLoading ? loadingText : text}
      </button>
    )
  }
)
AuthButton.displayName = "AuthButton"

export { AuthButton }