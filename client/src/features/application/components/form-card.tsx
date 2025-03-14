import { cn } from "@/lib/utils";

export function FormCard({ className, children } : { className?: string, children: React.ReactNode }) {
  return (
    <div className={cn([
      "bg-white mx-auto mb-24 rounded-3xl w-[1100px] max-w-[90%] h-[3000px]",
      className
    ])}>
      {children}
    </div>
  )
}