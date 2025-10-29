import { cn } from "@/lib/utils";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton({ children, className } : { children : React.ReactNode, className?: string }) {
  const router = useRouter()
  return (
    <div onClick={() => router.push('/')} role='button' className={cn([
      "inline-flex font-bagel text-white hover:underline h-auto items-center gap-4",
      className
    ])}>
      <MoveLeft size={32} />
      <span className="text-2xl">
        {children}
      </span>
    </div>
  )
} 