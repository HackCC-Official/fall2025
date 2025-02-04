import { EventTable } from "@/features/event/components/event-table"
import PanelLayout from "../layout"
import { getEvents } from "@/features/event/api/event";
import { EventDTO } from "@/features/event/types/event-dto";

export const getStaticProps = (async () => {
  const events = await getEvents();
  console.log(events)
  return { props: { events } }
})

export default function EventPage({ events } : { events: EventDTO[] }) {
  return (
    <div>
      <h1 className="font-semibold text-4xl">Event</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Manage the hackathon event by creating event dates which represent the actual day the hackathon is taking place
      </p>
      <EventTable events={events} />
    </div>
  )
}

EventPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>