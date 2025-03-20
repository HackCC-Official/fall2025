import { EventTable } from "@/features/event/components/event-table"
import PanelLayout from "../layout"
import { getEvents } from "@/features/event/api/event";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { PanelHeader } from "@/components/panel-header";
export default function EventPage() {
  const router = useRouter()
  const { isLoading, data } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(),
  })

  return (
    <div>
      <PanelHeader>Events</PanelHeader>
      <div className="flex space-x-4 my-4">
        <Button onClick={() => router.push('/panel/event/create')}>
          <Plus />
          Create Event
        </Button>
      </div>
      <EventTable isLoading={isLoading} events={data || []} />
    </div>
  )
}

EventPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>