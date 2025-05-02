
import PanelLayout from "../layout"
import { deleteEvent, getEvents } from "@/features/event/api/event";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PanelHeader } from "@/components/panel-header";
import { useState } from "react";
import { EventDTO } from "@/features/event/types/event-dto";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { EventForm } from "@/features/event/components/event-form";
import { ContextOption, DataTable } from "@/components/data-table";
import { columns } from '@/features/event/components/event-table/columns'
export default function EventPage() {
  const [eventId, setEventId] = useState<string>('');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { isLoading, data } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(),
  })

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    }
  })

  function onCreate() {
    setEventId('')
    setTimeout(() => {
      setOpen(true);
    }, 0);
  }
  
  function onEdit(value: EventDTO) {
    setEventId(value.id || '');
    setTimeout(() => {
      setOpen(true);
    }, 0);
  }

  function onDelete(value: EventDTO) {
    deleteEventMutation.mutate(value.id || '')
  }

  const eventContextOptions: ContextOption<EventDTO>[] = [
    {
      label: 'Edit event',
      icon: Edit,
      onClick: onEdit
    },
    {
      label: 'Delete event',
      icon: Trash,
      onClick: onDelete
    }
  ]

  const createOrUpdate = eventId ? 'Update' : 'Create';

  return (
    <div>
      <PanelHeader>Events</PanelHeader>
      <div className="flex space-x-4 my-4">
        <Sheet open={open} onOpenChange={setOpen} modal={false}>
          <SheetTrigger asChild>
            <Button onClick={onCreate}>
              <Plus />
              Create Event
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col sm:max-w-[500px] h-full">
              <SheetHeader>
                <SheetTitle>{createOrUpdate} Event</SheetTitle>
                <SheetDescription>
                  {createOrUpdate} an event for the hackathon
                </SheetDescription>
              </SheetHeader>
              <Separator className="my-4" />
              <EventForm eventId={eventId} setEventId={setEventId} setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable isLoading={isLoading} columns={columns} data={data || []} contextOptions={eventContextOptions} />
    </div>
  )
}

EventPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>