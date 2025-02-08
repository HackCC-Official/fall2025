import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { EventDTO } from "../types/event-dto";
import { useRouter } from "next/router";
import { deleteEvent } from "../api/event";

interface EventActionsProps {
  event: EventDTO;
}

export function EventActions({ event } : EventActionsProps) {
  const router = useRouter()
  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => router.push('/panel/event/edit/' + event.id)} variant='ghost' size='icon'>
        <Edit />
      </Button>
      <Button onClick={
        async () => {
          await deleteEvent(event.id || '')
          router.replace(router.asPath)
        }
      } variant='ghost' size='icon'
      >
        <Trash />
      </Button>
    </div>
  )
}