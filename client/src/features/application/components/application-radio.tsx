import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export function ApplicationRadioGroup({ className, defaultValue, children } : { className?: string, defaultValue?: string, children: React.ReactNode }) {
  return (
    <RadioGroup className={cn([
      "space-y-4",
      className
    ])} defaultValue={defaultValue}>
      {children}
    </RadioGroup>
  )
}

interface ApplicationRadioItemProps {
  value?: string | number | File | null | readonly string[]; // Add support for readonly string[]
  id: string;
  onChange?: (value: string) => void; // Add onChange prop
}

export function ApplicationRadioItem({ value, id, onChange }: ApplicationRadioItemProps) {
  const sanitizedValue = String(value);

  const handleChange = () => {
    if (onChange) {
      onChange(sanitizedValue); // Trigger onChange with the sanitized value
    }
  };

  return (
    <div className="flex items-center space-x-4 font-mont">
      <RadioGroupItem
        className="accent-royalpurple"
        value={sanitizedValue}
        onClick={handleChange} // Trigger onChange when the radio button is clicked
      />
      <Label className="font-mont font-semibold text-black text-xs md:text-base" htmlFor={id}>
        {sanitizedValue}
      </Label>
    </div>
  );
}