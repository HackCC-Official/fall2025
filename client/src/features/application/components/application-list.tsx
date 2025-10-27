import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CircleUser } from "lucide-react";
import { ContactBadge, EmailBadge, SchoolBadge } from "./application-status";
import { ApplicationResponseDTO } from "../types/application";
import { useRouter } from "next/router";

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

export function ApplicationItem({ application } : { application: ApplicationResponseDTO }) {
  const router = useRouter()
  return (
    <Card onClick={() => router.push('/panel/application/' + application.id)} className="group hover:bg-lightpurple transition-all cursor-pointer">
      <CardHeader className="flex lg:flex-row flex-col lg:items-centerg gap-1 lg:gap-4 p-4">
        <CardTitle className="flex items-center gap-4 font-semibold group-hover:text-white text-xl">
          <div className="flex bg-purple-50 p-1 border border-lightpurple rounded-md text-lightpurple">
            <CircleUser className="w-4 lg:w-8 h-4 lg:h-8" />
          </div>
          <div className="text-lg lg:text-xl">
            {application.firstName} {application.lastName}
          </div>
        </CardTitle>
        <Separator className="max-lg:hidden h-8" orientation="vertical" />
        <CardDescription className="flex items-center">
          <div className="flex flex-wrap gap-1 md:gap-2">
            <EmailBadge>{application.email}</EmailBadge>
            <ContactBadge>{application.phoneNumber}</ContactBadge>
            <SchoolBadge>{application.school}</SchoolBadge>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}