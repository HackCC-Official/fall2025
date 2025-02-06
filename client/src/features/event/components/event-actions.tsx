import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { EventDTO } from "../types/event-dto";
import { useRouter } from "next/router";

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
      <Button variant='ghost' size='icon'>
        <Trash />
      </Button>
    </div>
  )
}