import { SkyFixed } from "@/components/sky";
import { Homebg } from "@/features/home-page/components/homebg";
import { cn } from "@/lib/utils";

export function FrontPagePrimaryLayout({ children, className } : { children?: React.ReactNode, className?: string }) {
  return (
    <div className={cn([
      "relative w-screen h-screen",
      className
    ])}>
      <Homebg></Homebg>
      {children}
    </div>
  )
}

export function FrontPageSecondaryLayout({ children } : { children?: React.ReactNode }) {
  return (
    <div className="relative w-screen h-screen overflow-x-hidden">
      <SkyFixed />
      {children}
    </div>
  )
}