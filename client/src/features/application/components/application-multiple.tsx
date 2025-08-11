import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function ApplicationMultiple({ className, defaultValues, children } : { 
  className?: string, 
  defaultValues?: string[], 
  children: React.ReactNode 
}) {
  return (
    <div className={cn([
      "space-y-4",
      className
    ])}>
      {children}
    </div>
  )
}

interface ApplicationCheckboxItemProps {
  value?: string;
  id: string;
  onChange?: (value: string, checked: boolean) => void;
  defaultChecked?: boolean;
}

export function ApplicationCheckboxItem({ value, id, onChange, defaultChecked }: ApplicationCheckboxItemProps) {
  const sanitizedValue = String(value);
  
  const handleChange = (checked: boolean) => {
    if (onChange) {
      onChange(sanitizedValue, checked);
    }
  };
  
  return (
    <div className="flex items-center space-x-4 font-mont">
      <Checkbox
        className="disabled:opacity-50 shadow-none border border-[#E5E8EC] focus:outline-none focus-visible:ring-1 focus-visible:ring-ring w-4 md:w-6 h-5 md:h-6 aspect-square text-primary accent-royalpurple disabled:cursor-not-allowed"
        id={id}
        defaultChecked={defaultChecked}
        onCheckedChange={handleChange}
      />
      <Label className="font-mont font-semibold text-black text-xs md:text-base" htmlFor={id}>
        {sanitizedValue}
      </Label>
    </div>
  );
}
