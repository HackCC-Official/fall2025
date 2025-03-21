import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CircleUser } from "lucide-react";
import { ContactBadge, EmailBadge, SchoolBadge } from "./application-status";

interface ApplicationListProps {
  children: React.ReactNode;
  className?: string;
}

export function ApplicationList({ children, className } : ApplicationListProps) {
  return (
    <div className={cn([
      'bg-muted border-none shadow-none rounded-2xl py-4 pl-4 pr-1',
      className
    ])}>
      <div className="relative h-full">
        <div className="absolute inset-0 space-y-2 pr-4 overflow-scroll">
          {children}
        </div>
      </div>
    </div>
  )
}

export function ApplicationItem() {
  return (
    <Card className="group hover:bg-lightpurple transition-all cursor-pointer">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <CardTitle className="flex items-center gap-4 font-semibold group-hover:text-white text-xl">
          <div className="flex bg-purple-50 p-2 border border-lightpurple rounded-md text-lightpurple">
            <CircleUser />
          </div>
          <div>
            Evan (Eang Cheang) Ly
          </div>
        </CardTitle>
        <Separator className="h-8" orientation="vertical" />
        <CardDescription className="space-x-2">
          <EmailBadge>eangchheangly@gmail.com</EmailBadge>
          <ContactBadge>+855 069 980 981</ContactBadge>
          <SchoolBadge>Santa Monica College</SchoolBadge>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}