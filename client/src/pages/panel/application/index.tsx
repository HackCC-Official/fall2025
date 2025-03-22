import { PanelHeader } from "@/components/panel-header";
import PanelLayout from "../layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationStatus } from "@/features/application/types/status.enum";
import { FolderCheck, FolderSearch, FolderX } from "lucide-react";
import { useState } from "react";
import { ApplicationItem, ApplicationList } from "@/features/application/components/application-list";

export default function ApplicationPage() {
  const [status, setStatus] = useState(ApplicationStatus.SUBMITTED)
  return (
    <div className="flex flex-col h-full">
      <PanelHeader>Applications</PanelHeader>
      <Tabs className="mt-4" onValueChange={(s) => setStatus(s as ApplicationStatus)} value={status}>
        <TabsList className="w-full">
          <TabsTrigger className="flex items-center gap-2 w-full" value={ApplicationStatus.SUBMITTED}><FolderSearch size={16} /> Submitted</TabsTrigger>
          <TabsTrigger className="flex items-center gap-2 w-full" value={ApplicationStatus.ACCEPTED}><FolderCheck size={16} /> Accepted</TabsTrigger>
          <TabsTrigger className="flex items-center gap-2 w-full" value={ApplicationStatus.DENIED}><FolderX size={16} /> Denied</TabsTrigger>
        </TabsList> 
      </Tabs>
      <ApplicationList className="flex-grow mt-4">
        <ApplicationItem />
        <ApplicationItem />
        <ApplicationItem />
        <ApplicationItem />
        <ApplicationItem />
        <ApplicationItem />
        <ApplicationItem />
      </ApplicationList>
    </div>
  ) 
}


ApplicationPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>