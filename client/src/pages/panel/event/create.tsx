import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import PanelLayout from "../layout"

import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { TimePicker12 } from "@/components/time-picker/time-picker-12hr"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/router"
import { createEvent } from "@/features/event/api/event"

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

export default function CreateEventPage() {
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

  console.log(process.env.QR_SERVICE_URL)

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({
      date: format(values.date, 'y-M-d'),
      startingTime: values.startingTime.toISOString(),
      lateTime: values.lateTime.toISOString(),
      endingTime:  values.endingTime.toISOString(),
      active: values.active,
      breakfast: values.breakfast,
      lunch: values.lunch,
      dinner: values.dinner
    })
    await createEvent({
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
    <div>
      <h1 className="font-bold text-4xl">Create Event</h1>
      <p className="mt-2 text-muted-foreground text-sm">
        Create Event Date object that signifies an active Hackathon day
      </p>
      <div className="w-full lg:w-[75%] xl:w-[60%]">
        <Separator className="my-8" />
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
      </div>
    </div>
  )
}

CreateEventPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>