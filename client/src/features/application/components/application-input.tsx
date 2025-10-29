import * as React from "react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ApplicationInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value?: string | number | File | null | readonly string[]; // Add support for readonly string[]
}

const ApplicationInput = React.forwardRef<HTMLInputElement, ApplicationInputProps>(
  ({ className, type, value = '', ...props }, ref) => {
    const sanitizedValue = value === null || value instanceof File ? "" : value;
    return (
      <input
        value={sanitizedValue}
        type={type}
        className={cn(
          "bg-[#F9F9FB] p-4 md:p-6 rounded-2xl w-full font-semibold text-black placeholder:text-[#696E75] text-xs md:text-base",
          className
        )}
        ref={ref}
        {...props} // This already accepts {...field}
      />
    );
  }
);
ApplicationInput.displayName = "Input";

export { ApplicationInput }

interface ApplicationTextareaProps extends Omit<React.ComponentProps<"textarea">, 'value'> {
  value?: string | number | File | null | readonly string[]; // Add support for readonly string[]
  maxWord?: number;
}

const ApplicationTextarea = React.forwardRef<HTMLTextAreaElement, ApplicationTextareaProps>(
  ({ className, maxWord = 150, value, ...props }, ref) => {
    const sanitizedValue = value === null || value instanceof File ? "" : value;
    const len = value ? String(value).split(/[\s]+/).length : 0

    const ALMOST_FULL_FACTOR = 0.8;

    const showGreen = len / maxWord < ALMOST_FULL_FACTOR;
    const showAmber = (len < maxWord) && len / maxWord >= ALMOST_FULL_FACTOR;
    const showRed = len >= maxWord;

    
    return (
      <>
        <textarea
          value={sanitizedValue}
          rows={8}
          className={cn(
            "bg-[#F9F9FB] p-2 md:p-6 border-0 rounded-2xl focus:ring-1 w-full font-semibold text-black placeholder:text-[#696E75]",
            className
          )}
          ref={ref}
          {...props} // This will accept {...field}
        />
        <Badge className={cn([
          showGreen && 'bg-green-500 hover:bg-green-600',
          showAmber && 'bg-amber-500 hover:bg-amber-600',
          showRed && 'bg-red-500 hover:bg-red-600'
        ])}>{len} / {maxWord}</Badge>
      </>
    );
  }
);
ApplicationTextarea.displayName = "Textarea";

export { ApplicationTextarea }

const ApplicationCalendar = React.forwardRef<HTMLButtonElement, { className?: string, value?: Date, onChange?: (date: Date | undefined) => void }>(
  ({ className, value, onChange, ...props }, ref) => {
    const [date, setDate] = React.useState<Date | undefined>(value);

    // Sync the date state with the value from {...field}
    React.useEffect(() => {
      console.log(date, value)
      setDate(value);
    }, [value]);

    // Handle date selection
    const handleDateSelect = (selectedDate: Date | undefined) => {
      console.log(selectedDate)
      setDate(selectedDate);
      if (onChange) {
        onChange(selectedDate);
      }
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "bg-[#F9F9FB] hover:bg-[#F9F9FB] shadow-none px-6 py-6 rounded-2xl w-full h-auto font-semibold text-black placeholder:text-[#696E75]",
              !date && "text-muted-foreground",
              className
            )}
            ref={ref}
            {...props} // This will accept {...field}
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
            onSelect={handleDateSelect}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
          />
        </PopoverContent>
      </Popover>
    );
  }
);
ApplicationCalendar.displayName = "Calendar";

export { ApplicationCalendar }

export function ApplicationError({ children } :  { children: React.ReactNode }) {
  return (
    <p className="mt-4 font-semibold text-red-500 text-sm">{children}</p>
  )
}

import { Label } from "@/components/ui/label";

export function ApplicationLabel({ className, children } : { className?: string, children: React.ReactNode }) {
  return (
    <Label className={cn([
      'text-xl md:text-[25px] font-bagel',
      className,
    ])}>{children}</Label>
  )
}