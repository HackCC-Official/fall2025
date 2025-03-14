import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export function ApplicationMultipleGroup({ className, defaultValue, children } : { className?: string, defaultValue?: string, children: React.ReactNode }) {
  return (
    <RadioGroup className={cn([
      "space-y-4",
      className
    ])} defaultValue={defaultValue}>
      {children}
    </RadioGroup>
  )
}

export function ApplicationMultipleItem({ value, id } : { value: string, id: string }) {
  return (
    <div className="flex items-center space-x-4 font-mont">
      <RadioGroupItem className="accent-royalpurple" value={value} id={id} />
      <Label className='font-mont font-semibold text-black text-xs md:text-base' htmlFor={value} >{value}</Label>
    </div>
  )
}