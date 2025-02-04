import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { EventDTO } from "../../types/event-dto";

export function EventTable({ events } : { events: EventDTO[] }) {
  return (
    <div className="mx-auto py-10 container">
      <DataTable columns={columns} data={events} />
    </div>
  )
}