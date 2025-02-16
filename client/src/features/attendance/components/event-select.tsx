import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventDTO } from "@/features/event/types/event-dto";

export function EventSelect({ events }: { events: EventDTO[] }) {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Event date" />
      </SelectTrigger>
      <SelectContent>
        {events.map(e => 
          <SelectItem key={e.id} value={e.date}>
            {e.date}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}