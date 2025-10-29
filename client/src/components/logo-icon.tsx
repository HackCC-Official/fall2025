import Image from "next/image";
import logo from "../assets/hackcc.png"
import { cn } from "@/lib/utils";

export function LogoIcon({ className } : { className?: string }) {
  return (
    <div className={cn([
      "bg-lightpurple hover:bg-royalpurple rounded-[25%] overflow-hidden aspect-square",
      className
    ])}>
      <Image className="rounded-md max-w-full max-h-full aspect-square object-contain" src={logo} alt="HackCC Logo"/>
    </div>
  )
}