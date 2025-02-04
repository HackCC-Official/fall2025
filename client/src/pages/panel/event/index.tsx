import { EventTable } from "@/features/event/components/event-table"
import PanelLayout from "../layout"
import { getEvents } from "@/features/event/api/event";
import { EventDTO } from "@/features/event/types/event-dto";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/router";

export const getStaticProps = (async () => {
  try {
    const events = await getEvents();
    return { props: { events } }
  } catch (error) {
    console.error('Error fetching data during build:', error);
    return { props: { data: [] } };
  }
})

export default function EventPage({ events } : { events: EventDTO[] }) {
  const router = useRouter()
  return (
    <div>
      <h1 className="font-bold text-4xl">Event</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Manage the hackathon event by creating event dates which represent the actual day the hackathon is taking place
      </p>
      <div className="flex space-x-4 my-4">
        <Button onClick={() => router.push('/panel/event/create')}>
          <Plus />
          Create Event
        </Button>
      </div>
      <EventTable events={events} />
    </div>
  )
}

EventPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>