import { Input } from "@/components/ui/input";

interface AttendanceSearchProps {
  q: string;
  setQ: (q: string) => void;
}

export function AttendanceSearch({ q, setQ }: AttendanceSearchProps) {
  return (
    <Input value={q} onInput={(e) => setQ(e.currentTarget.value)} className="w-[400px]" placeholder="Search Attendances..." />
  )
}