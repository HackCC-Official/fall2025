import { useRouter } from "next/router"
import PanelLayout from "../../layout"
import { Separator } from "@/components/ui/separator"
import { EventForm } from "@/features/event/components/event-form"
import { EventDTO } from "@/features/event/types/event-dto"
import { updateEvent } from "@/features/event/api/event"

export default function EventEditPage() {
  const router = useRouter()

  async function handleSubmit(eventDTO: EventDTO) {
    return await updateEvent(router.query.id as string, eventDTO)
  }

  return (
    <div>
      <h1 className="font-bold text-4xl">Update Event</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Updae Event Date object that signifies an active Hackathon day
      </p>
      <div className="w-full lg:w-[75%] xl:w-[60%]">
        <Separator className="my-8" />
        <EventForm id={router.query.id as string} handleSubmit={handleSubmit} />
      </div>
    </div>
  )
}

EventEditPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>