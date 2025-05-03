import { ColumnDef } from "@tanstack/react-table";
import { ResponseTeamDTO } from "../../type/team";
import { format } from "date-fns";
import { AccountBadge } from "../../../account/components/account-badge";

export const columns: ColumnDef<ResponseTeamDTO>[] = [
  {
    accessorKey: 'name',
    header: 'Team\'s Name',
    cell: ({ row }) => <div className="font-semibold">{row.original.name}</div>
  },
  {
    accessorKey: 'accounts',
    header: 'Members',
    cell: ({ row }) => 
    <div className="flex flex-wrap gap-2">
      {
        row.original.accounts.map(a => (
          <AccountBadge account={a} key={a.id} />
        ))
      }
    </div>
  },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) => format(row.original.createdAt || '', 'MMM, do yyyy')
    },
]