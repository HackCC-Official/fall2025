import { PanelHeader } from "@/components/panel-header";
import PanelLayout from "../layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationStatus } from "@/features/application/types/status.enum";
import { FolderCheck, FolderSearch, FolderX } from "lucide-react";
import { useState } from "react";
import { ApplicationItem, ApplicationList } from "@/features/application/components/application-list";
import { useQuery } from "@tanstack/react-query";
import { getApplicationsStats } from "@/features/application/api/application";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getHackathonApplications } from "@/features/application/api/hackathon-application";

function ApplicationListSkeleton() {
  return (
    <>
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-16" />
      <Skeleton className="w-full h-16" />
    </>
  )
}

export default function ApplicationPage() {
  const [status, setStatus] = useState(ApplicationStatus.SUBMITTED)
  const { isLoading, data } = useQuery({
    queryKey: ['hackathon-applications', status],
    queryFn: () => getHackathonApplications({ status })
  })

  const statQuery = useQuery({
    queryKey: ['applications-stats'],
    queryFn: () => getApplicationsStats()
  })

  return (
    <div className="flex flex-col h-full">
      <PanelHeader className="flex items-center">
        Applications
        {
          statQuery.data &&
          <div className="inline-flex items-center gap-2 ml-4">
            <Badge>
              Submitted
              <span className="ml-2 font-light">{statQuery.data.submitted}</span>
            </Badge>
            <Badge className="bg-emerald-500 hover:bg-emerald-600">
              Accepted 
              <span className="ml-2 font-light">{statQuery.data.accepted}</span>
            </Badge>
            <Badge className="bg-red-500 hover:bg-red-600">
              Denied 
              <span className="ml-2 font-light">{statQuery.data.denied}</span>
            </Badge>
          </div>
        }
      </PanelHeader>
      <Tabs className="mt-4" onValueChange={(s) => setStatus(s as ApplicationStatus)} value={status}>
        <TabsList className="w-full">
          <TabsTrigger className="flex items-center gap-2 w-full" value={ApplicationStatus.SUBMITTED}><FolderSearch size={16} /> Submitted</TabsTrigger>
          <TabsTrigger className="flex items-center gap-2 w-full" value={ApplicationStatus.ACCEPTED}><FolderCheck size={16} /> Accepted</TabsTrigger>
          <TabsTrigger className="flex items-center gap-2 w-full" value={ApplicationStatus.DENIED}><FolderX size={16} /> Denied</TabsTrigger>
        </TabsList> 
      </Tabs>
      <ApplicationList className="flex-grow mt-4">
        {
          isLoading
          ?
          <ApplicationListSkeleton />
          :
          data && data.map(a => (
            <ApplicationItem key={a.id} application={a} />
          ))
        }
      </ApplicationList>
    </div>
  ) 
}


ApplicationPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>