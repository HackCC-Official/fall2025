import { Badge } from "@/components/ui/badge"
import { Mail, Phone, School } from "lucide-react"

export function EmailBadge({ children } : { children: React.ReactNode }) {
  return (
    <Badge variant='outline' className="rounded-full group-hover:text-white cursor-pointer">
      <Mail size={16} className="mr-2" />
      {children}
    </Badge>
  )
}

export function ContactBadge({ children } : { children: React.ReactNode }) {
  return (
    <Badge className="bg-amber-50 hover:bg-amber-500 border border-amber-500 rounded-full text-amber-500 hover:text-white cursor-pointer hover:light-purple">
      <Phone size={16} className="mr-2" />
      {children}
    </Badge>
  )
}

export function SchoolBadge({ children } : { children: React.ReactNode }) {
  return (
    <Badge className="bg-sky-50 hover:bg-sky-500 border border-sky-500 rounded-full text-sky-500 hover:text-white cursor-pointer hover:light-purple">
      <School size={16} className="mr-2" />
      {children}
    </Badge>
  )
}