import { cn } from "@/lib/utils";
import React from "react"

interface PanelInterfaceProps {
  children: React.ReactNode;
  className?: string;
}

export function PanelHeader({ children, className }: PanelInterfaceProps) {
  return (
    <h1 className={cn([
<<<<<<< Updated upstream
      "font-bold text-3xl",
=======
      "font-bold text-lg md:text-xl lg:text-3xl",
>>>>>>> Stashed changes
      className
    ])}>
      {children}
    </h1>
  )
}