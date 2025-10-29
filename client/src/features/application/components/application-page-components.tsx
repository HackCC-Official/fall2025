import { PanelHeader } from "@/components/panel-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationStatus } from "@/features/application/types/status.enum";
import { FolderCheck, FolderSearch, FolderX } from "lucide-react";
import { useState } from "react";
import { ApplicationItem, ApplicationList } from "@/features/application/components/application-list";
import { useQuery } from "@tanstack/react-query";
import { getHackathonApplicationsStats } from "@/features/application/api/hackathon-application";
import { getJudgeApplicationsStats } from "@/features/application/api/judge-application";
import { getVolunteerApplicationsStats } from "@/features/application/api/volunteer-application";
import { getOrganizerApplicationsStats } from "@/features/application/api/organizer-application";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getHackathonApplications } from "@/features/application/api/hackathon-application";
import { getJudgeApplications } from "@/features/application/api/judge-application";
import { getVolunteerApplications } from "@/features/application/api/volunteer-application";
import { getOrganizerApplications } from "@/features/application/api/organizer-application";
import { Select, SelectContent, SelectLabel, SelectTrigger, SelectGroup, SelectValue, SelectItem } from "@/components/ui/select";
import { ApplicationType } from "@/features/application/types/application";
import { useRouter } from "next/router";

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

// Helper function to get the correct API function based on application type
function getApplicationsFunction(applicationType: ApplicationType) {
  switch (applicationType) {
    case ApplicationType.HACKATHON:
      return getHackathonApplications;
    case ApplicationType.JUDGE:
      return getJudgeApplications;
    case ApplicationType.VOLUNTEER:
      return getVolunteerApplications;
    case ApplicationType.ORGANIZER:
      return getOrganizerApplications;
    default:
      return getHackathonApplications;
  }
}

// Helper function to get the correct stats API function based on application type
function getApplicationsStatsFunction(applicationType: ApplicationType) {
  switch (applicationType) {
    case ApplicationType.HACKATHON:
      return getHackathonApplicationsStats;
    case ApplicationType.JUDGE:
      return getJudgeApplicationsStats;
    case ApplicationType.VOLUNTEER:
      return getVolunteerApplicationsStats;
    case ApplicationType.ORGANIZER:
      return getOrganizerApplicationsStats;
    default:
      return getHackathonApplicationsStats;
  }
}

interface ApplicationPageComponentProps {
  applicationType: ApplicationType;
}

export function ApplicationPageComponent({ applicationType }: ApplicationPageComponentProps) {
  const router = useRouter();
  const [status, setStatus] = useState(ApplicationStatus.SUBMITTED);

  // Update route when application type changes via select
  const handleApplicationTypeChange = (value: ApplicationType) => {
    const routeMap = {
      [ApplicationType.HACKATHON]: '/panel/application/hackathon',
      [ApplicationType.JUDGE]: '/panel/application/judge', 
      [ApplicationType.VOLUNTEER]: '/panel/application/volunteer',
      [ApplicationType.ORGANIZER]: '/panel/application/organizer'
    };
    router.push(routeMap[value]);
  };

  const { isLoading, data } = useQuery({
    queryKey: [`${applicationType}-applications`, status],
    queryFn: () => getApplicationsFunction(applicationType)({ status })
  });

  const statQuery = useQuery({
    queryKey: [`${applicationType}-applications-stats`],
    queryFn: () => getApplicationsStatsFunction(applicationType)()
  });

  return (
    <div className="flex flex-col h-full">
      <PanelHeader className="flex justify-between items-center">
        <div className="flex items-center">
          Applications
          {
            statQuery.data &&
            <div className="inline-flex items-center gap-2 ml-4">
              <Badge>
                Submitted
                <span className="ml-2 font-light">{statQuery.data.submitted || 0}</span>
              </Badge>
              <Badge className="bg-emerald-500 hover:bg-emerald-600">
                Accepted 
                <span className="ml-2 font-light">{statQuery.data.accepted || 0}</span>
              </Badge>
              <Badge className="bg-red-500 hover:bg-red-600">
                Denied 
                <span className="ml-2 font-light">{statQuery.data.denied || 0}</span>
              </Badge>
            </div>
          }
        </div>
        <div>
          <Select value={applicationType} onValueChange={handleApplicationTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select application type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  Application Type
                </SelectLabel>
                <SelectItem value={ApplicationType.HACKATHON}>Hackathon</SelectItem>
                <SelectItem value={ApplicationType.ORGANIZER}>Organizer</SelectItem>
                <SelectItem value={ApplicationType.VOLUNTEER}>Volunteer</SelectItem>
                <SelectItem value={ApplicationType.JUDGE}>Judge</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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