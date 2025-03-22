"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ApplicationSelectProps {
  className?: string;
  values: string[];
  placeholder: string;
  value?: string; // Controlled value
  onChange?: (value: string) => void; // Callback for value changes
}

export function ApplicationSelect({ className, values, placeholder, value: valueProp, onChange }: ApplicationSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(valueProp || "");

  // Sync internalValue with valueProp
  React.useEffect(() => {
    setInternalValue(valueProp || "");
  }, [valueProp]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === internalValue ? "" : currentValue;
    setInternalValue(newValue);
    setOpen(false);
    if (onChange) {
      onChange(newValue); // Notify parent component of the change
    }
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            aria-expanded={open}
            className="flex justify-between bg-[#F9F9FB] hover:bg-[#F9F9FB] shadow-none p-4 md:p-6 rounded-2xl w-full h-auto font-semibold text-black placeholder:text-[#696E75] text-xs md:text-base"
          >
            {internalValue
              ? internalValue
              : 'Select ' + placeholder}
            <ChevronDown size={24} className="ml-2 w-6 h-6 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-[#F9F9FB] shadow-none mt-2 md:mt-4 border-none rounded-[16px] w-[--radix-popover-trigger-width]">
          <Command className="bg-transparent w-full font-mont">
            <CommandInput className="bg-transparent font-mont" placeholder={'Search ' + placeholder} />
            <CommandList className="bg-transparent font-mont">
              <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {values.map((v) => (
                  <CommandItem
                    className="cursor-pointer"
                    key={v}
                    value={v}
                    onSelect={handleSelect} // Use handleSelect
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        internalValue === v ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {v}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}