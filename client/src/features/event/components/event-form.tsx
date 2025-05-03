import { TimePicker12 } from "@/components/time-picker/time-picker-12hr";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { createEvent, getEventByID, updateEvent } from "../api/event";
import { getCurrentTime } from "../utils/time";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventDTO } from "../types/event-dto";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  date: z.date(),
  startingTime: z.date(),
  lateTime: z.date(),
  endingTime: z.date(),
  active: z.boolean(),
  breakfast: z.boolean(),
  lunch: z.boolean(),
  dinner: z.boolean(),
})

interface EventFormProps {
  eventId?: string;
  setEventId?: Dispatch<SetStateAction<string>>;
  setOpen: (o: boolean) => void;
}

export function EventForm({ eventId, setEventId, setOpen } : EventFormProps) {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      startingTime: new Date(),
      lateTime: new Date(),
      endingTime: new Date(),
      active: true,
      breakfast: true,
      lunch: false,
      dinner: false
    }
  })

  const eventQuery = useQuery({
    queryKey: ['team', eventId],
    queryFn: () => eventId ? getEventByID(eventId) : undefined,
    enabled: !!eventId
  })

  const eventMutation = useMutation({
    mutationFn: (eventDTO: EventDTO) => eventId ? updateEvent(eventId, eventDTO) : createEvent(eventDTO),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['events']
      })
      if (eventId && setEventId) {
        setEventId('');
      }
      setOpen(false)
    }
  })
  

  useEffect(() => {
    if (eventId && eventQuery.data) {
      const eventDTO = eventQuery.data
      // date objects are already in UTC
      const startingTime = new Date(eventDTO.startingTime)
      const lateTime = new Date(eventDTO.lateTime)
      const endingTime = new Date(eventDTO.endingTime)

      form.reset({
        ...eventDTO,
        date: new Date(`${eventDTO.date}T00:00:00`),
        startingTime,
        lateTime,
        endingTime
      });
    }
  }, [eventId, eventQuery.data, form, form.reset]); 

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
      // get date
      const date = format(values.date, 'y-MM-dd');

      // get date in PST first then convert it into UTC
      const startingTime = new Date(`${date}T${getCurrentTime(values.startingTime)}-08:00`).toISOString()
      const lateTime = new Date(`${date}T${getCurrentTime(values.lateTime)}-08:00`).toISOString()
      const endingTime = new Date(`${date}T${getCurrentTime(values.endingTime)}-08:00`).toISOString()

      eventMutation.mutate({
        date,
        startingTime,
        lateTime,
        endingTime,
        active: values.active,
        breakfast: values.breakfast,
        lunch: values.lunch,
        dinner: values.dinner
      });
    }

  return (
    <Form {...form}> 
      <div className="relative h-full">
        <ScrollArea className="absolute inset-0 h-full">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h2 className="font-semibold text-2xl">Event Information</h2>
              <p className="mb-8 text-muted-foreground text-sm">
                {"Configure event's date starting, late, and ending time."}
              </p>
            </div>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="opacity-50 ml-auto w-4 h-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The day that the event is happening
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Time</FormLabel>
                  <TimePicker12 date={field.value} setDate={field.onChange} />
                  <FormDescription>
                    Time that the event is starting
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Late Time</FormLabel>
                  <TimePicker12 date={field.value} setDate={field.onChange} />
                  <FormDescription>
                    Time that the hackathon particpant is considered late
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="endingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ending Time</FormLabel>
                    <TimePicker12 date={field.value} setDate={field.onChange} />
                    <FormDescription>
                      Time that the event is ending
                    </FormDescription>
                  </FormItem>
                )}
              />
            <div>
              <h2 className="font-semibold text-2xl">Event Information</h2>
              <p className="mb-8 text-muted-foreground text-sm">
                {"Configure meals, status, etc."}
              </p>
            </div>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row justify-between items-center shadow-sm p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <FormLabel>Active</FormLabel>
                  <FormDescription>
                    Set if event date is active (disabling it disables the ability to check hackers in)
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breakfast"
              render={({ field }) => (
                <FormItem className="flex flex-row justify-between items-center shadow-sm p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <FormLabel>Breakfast</FormLabel>
                  <FormDescription>
                    Set if Breakfast is enabled
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lunch"
              render={({ field }) => (
                <FormItem className="flex flex-row justify-between items-center shadow-sm p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <FormLabel>Lunch</FormLabel>
                  <FormDescription>
                    Set if Lunch is enabled
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dinner"
              render={({ field }) => (
                <FormItem className="flex flex-row justify-between items-center shadow-sm p-3 border rounded-lg">
                <div className="space-y-0.5">
                  <FormLabel>Dinner</FormLabel>
                  <FormDescription>
                    Set if Dinner is enabled
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
              )}
            />
            <Button>
              {eventId ? 'Update event' : 'Create event'}
            </Button>
          </form>
        </ScrollArea>
      </div>
    </Form>
  )
}