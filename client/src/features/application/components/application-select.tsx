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


export function ApplicationSelect({ className, values, placeholder } : { className?: string, values: string[], placeholder: string }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover className={className} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="flex justify-between bg-[#F9F9FB] hover:bg-[#F9F9FB] shadow-none p-4 md:p-6 rounded-2xl w-full h-auto font-semibold text-black placeholder:text-[#696E75] text-xs md:text-base"
        >
          {value
            ? values.find((v) => v)
            : 'Select ' + placeholder }
          <ChevronDown size={24} className="ml-2 w-6 h-6 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-[#F9F9FB] shadow-none mt-2 md:mt-4 border-none rounded-[16px] w-[--radix-popover-trigger-width]">
        <Command className="bg-transparent w-full font-mont">
          <CommandInput className='bg-transparent font-mont' placeholder={'Search ' + placeholder} />
          <CommandList className='bg-transparent font-mont'>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {values.map((v) => (
                <CommandItem
                  className="cursor-pointer"
                  key={v}
                  value={v}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === v ? "opacity-100" : "opacity-0"
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
  )
}
