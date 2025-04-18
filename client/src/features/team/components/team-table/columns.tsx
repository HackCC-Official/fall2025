import { ColumnDef } from "@tanstack/react-table";
import { ResponseTeamDTO } from "../../type/team";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<ResponseTeamDTO>[] = [
  {
    accessorKey: 'name',
    header: 'Team\'s Name',
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>
  },
  {
    accessorKey: 'accounts',
    header: 'Members',
    cell: ({ row }) => 
    <div className="flex flex-wrap gap-2">
      {
        row.original.accounts.map(a => (
          <Badge key={a.id}>
            {a.firstName} {a.lastName}
          </Badge>
        ))
      }
    </div>
  },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => format(row.original.createdAt || '', 'MMM, do yyyy hh:mm aaaa')
    },
]