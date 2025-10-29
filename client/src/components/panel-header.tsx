import { cn } from "@/lib/utils";
import React from "react"

interface PanelInterfaceProps {
  children: React.ReactNode;
  className?: string;
}

export function PanelHeader({ children, className }: PanelInterfaceProps) {
  return (
    <h1 className={cn([
      "font-bold text-3xl",
      className
    ])}>
      {children}
    </h1>
  )
}