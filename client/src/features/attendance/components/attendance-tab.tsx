import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { columns } from "./attendance-table/columns";

export function AttendanceTab({ className } : { className?: string }) {
  return (
    <Tabs defaultValue="absent" className={cn([
      "w-full",
      className
    ])}>
      <TabsList className="w-full">
        <TabsTrigger className="w-full" value="all">All</TabsTrigger>
        <TabsTrigger className="w-full" value="absent">Absent</TabsTrigger>
        <TabsTrigger className="w-full" value="late">Late</TabsTrigger>
        <TabsTrigger className="w-full" value="present">Present</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <DataTable data={[]} columns={columns} />
      </TabsContent>
      <TabsContent value="absent">
        <DataTable data={[]} columns={columns} />
      </TabsContent>
      <TabsContent value="late">
        <DataTable data={[]} columns={columns} />
      </TabsContent>
      <TabsContent value="present">
        <DataTable data={[]} columns={columns} />
      </TabsContent>
    </Tabs>
  )
}