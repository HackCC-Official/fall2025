import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { columns } from "./attendance-table/columns";
import { AttendanceDTO, AttendanceStatus } from "../types/attendance-dto";

interface AttendanceTabProps {
  className?: string;
  setStatus: (status: AttendanceStatus) => void;
  isLoading: boolean;
  data: AttendanceDTO[];
}

export function AttendanceTab({ className, setStatus, isLoading, data } : AttendanceTabProps) {
  return (
    <Tabs defaultValue={AttendanceStatus.ALL} 
      onValueChange={(status) => setStatus(status as AttendanceStatus)}
      className={cn([
        "w-full",
        className
      ])}
    >
      <TabsList className="w-full">
        <TabsTrigger className="w-full" value={AttendanceStatus.ALL}>All</TabsTrigger>
        <TabsTrigger className="w-full" value={AttendanceStatus.ABSENT}>Absent</TabsTrigger>
        <TabsTrigger className="w-full" value={AttendanceStatus.LATE}>Late</TabsTrigger>
        <TabsTrigger className="w-full" value={AttendanceStatus.PRESENT}>Present</TabsTrigger>
      </TabsList>
      <TabsContent value={AttendanceStatus.ALL}>
        <DataTable isLoading={isLoading} data={data} columns={columns} />
      </TabsContent>
      <TabsContent value={AttendanceStatus.ABSENT}>
        <DataTable isLoading={isLoading} data={data} columns={columns} />
      </TabsContent>
      <TabsContent value={AttendanceStatus.LATE}>
        <DataTable isLoading={isLoading} data={data} columns={columns} />
      </TabsContent>
      <TabsContent value={AttendanceStatus.PRESENT}>
        <DataTable isLoading={isLoading} data={data} columns={columns} />
      </TabsContent>
    </Tabs>
  )
}