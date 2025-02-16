import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EventSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Event date" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="2025-02-04">
          2025-02-04
        </SelectItem>
        <SelectItem value="2025-02-11">
          2025-02-11
        </SelectItem>
      </SelectContent>
    </Select>
  )
}