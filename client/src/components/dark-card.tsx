import { cn } from "@/lib/utils";

export function DarkCard({ children, className } : { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn([
      'relative flex flex-col bg-black/20 px-7 py-7 rounded-3xl w-[275px] sm:w-[350px] font-mont text-xl text-center',
      className
    ])}>
      {children}
    </div>
  )
}