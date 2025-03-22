import * as React from "react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

const ApplicationInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "p-4 md:p-6 text-xs md:text-base rounded-2xl placeholder:text-[#696E75] font-semibold w-full text-black bg-[#F9F9FB]",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
ApplicationInput.displayName = "Input"

export { ApplicationInput }

export function ApplicationTextarea({ className } : { className?: string }) {
  return (
    <textarea
      rows={8}
      className={cn([
        "p-2 md:p-6 rounded-2xl placeholder:text-[#696E75] font-semibold w-full text-black bg-[#F9F9FB] border-0 focus:ring-1",
        className
      ])}
    >

    </textarea>
  )
}


export function ApplicationCalendar({ className } : { className?: string }) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "px-6 py-6 h-auto shadow-none hover:bg-[#F9F9FB] rounded-2xl placeholder:text-[#696E75] font-semibold w-full text-black bg-[#F9F9FB]",
            !date && "text-muted-foreground",
            className
          )}
        >
          {date ? (
            format(date, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon size={24} className="ml-auto w-6 h-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" align="start">
        <Calendar
          mode="single"
          className="font-mont"
          selected={date}
          onSelect={setDate}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
        />
      </PopoverContent>
    </Popover>
  )
}