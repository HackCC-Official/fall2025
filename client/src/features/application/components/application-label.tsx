import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ApplicationLabel({ className, children } : { className?: string, children: React.ReactNode }) {
  return (
    <Label className={cn([
      'text-xl md:text-[25px] font-bagel',
      className,
    ])}>{children}</Label>
  )
}