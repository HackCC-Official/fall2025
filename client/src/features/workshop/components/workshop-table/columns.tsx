import { ColumnDef } from "@tanstack/react-table";
import { WorkshopResponseDTO } from "../../types/workshop";
import { AccountBadge } from "@/features/account/components/account-badge";

export const columns: ColumnDef<WorkshopResponseDTO>[] = [
  {
    accessorKey: 'name',
    header: 'Workshop name',
    cell: ({ row }) => <div className="font-semibold">{row.original.name}</div>
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'organizers',
    header: 'Organizers',
    cell: ({ row }) => 
    <div className="flex flex-wrap gap-2">
      {
        row.original.organizers.map(a => (
          <AccountBadge account={a} key={a.id} />
        ))
      }
    </div>
  }
]