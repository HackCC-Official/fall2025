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
import { EventDTO } from "../types/event-dto";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getEventByID } from "../api/event";

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
  id?: string;
  handleSubmit: (event: EventDTO) => Promise<EventDTO>;
}

export function EventForm({ id, handleSubmit } : EventFormProps) {
  const router = useRouter()
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

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const eventDTO = await getEventByID(id);
        form.reset({
          ...eventDTO,
          date: new Date(`${eventDTO.date}T00:00:00`),
          startingTime: new Date(eventDTO.startingTime),
          lateTime:  new Date(eventDTO.lateTime),
          endingTime:   new Date(eventDTO.endingTime),
        });
      }
    };

    if (id) {
      fetchData();
    }
  }, [form, form.reset, id]); 

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
      await handleSubmit({
        date: format(values.date, 'y-M-d'),
        startingTime: values.startingTime.toISOString(),
        lateTime: values.lateTime.toISOString(),
        endingTime:  values.endingTime.toISOString(),
        active: values.active,
        breakfast: values.breakfast,
        lunch: values.lunch,
        dinner: values.dinner
      });
  
      router.push('/panel/event')
    }

  return (
    <Form {...form}> 
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

      <div className="lg:flex justify-between items-center gap-2 space-y-8 lg:space-y-0">
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
      </div>
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
        Submit
      </Button>
    </form>
  </Form>
  )
}