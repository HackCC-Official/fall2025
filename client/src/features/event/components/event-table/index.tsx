import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { EventDTO } from "../../types/event-dto";

export function EventTable({ isLoading, events } : { isLoading: boolean, events: EventDTO[] }) {
  return (
    <div className="mx-auto">
      <DataTable isLoading={isLoading} columns={columns} data={events} />
    </div>
  )
}