import { Input } from "@/components/ui/input";

interface AttendanceSearchProps {
  q: string;
  setQ: (q: string) => void;
  placeholder: string;
}

export function InputSearch({ q, setQ, placeholder }: AttendanceSearchProps) {
  return (
    <Input value={q} onInput={(e) => setQ(e.currentTarget.value)} className="w-[400px]" placeholder={placeholder} />
  )
}