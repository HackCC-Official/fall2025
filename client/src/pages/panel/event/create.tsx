import { EventForm } from "@/features/event/components/event-form"
import PanelLayout from "../layout"
import { Separator } from "@/components/ui/separator"
import { createEvent } from "@/features/event/api/event"


export default function CreateEventPage() {
  return (
    <div>
      <h1 className="font-bold text-4xl">Create Event</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Create Event Date object that signifies an active Hackathon day
      </p>
      <div className="w-full lg:w-[75%] xl:w-[60%]">
        <Separator className="my-8" />
        <EventForm handleSubmit={createEvent} />
      </div>
    </div>
  )
}

CreateEventPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>