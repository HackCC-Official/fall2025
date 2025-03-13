import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventDTO } from "@/features/event/types/event-dto";

interface EventSelectProps {
  value?: EventDTO;
  onClick: (eventDTO: EventDTO) => void;
  events: EventDTO[];
}

export function EventSelect({ value, onClick, events }: EventSelectProps) {
  return (
    <Select value={value?.date} onValueChange={(d) => onClick(events.find(e => e.date === d) as EventDTO)}>
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