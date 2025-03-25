import { cn } from "@/lib/utils"
import Image from "next/image"
import LogoImg from '../../public/Logo.webp'

export function Logo({ className } : { className?: string }) {
  return (
    <Image className={cn([
      "z-10 ml-[5%] w-auto h-32 sm:h-48 md:h-36 lg:h-42 2xl:h-56",
      className
    ])} src={LogoImg} alt="HackCC Logo" sizes="(min-width: 1540px) 290px, (min-width: 780px) 187px, (min-width: 640px) 249px, 166px"></Image>
  )
}