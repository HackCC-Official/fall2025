import { ColumnDef } from "@tanstack/react-table";
import { AccountDTO } from "../../types/account-dto";
import { RolesBadge } from "../roles-badge";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<AccountDTO>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <Badge variant='outline' className="">{row.original.email}</Badge>
  },
  {
    accessorKey: 'firstName',
    header: 'First Name'
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name'
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => <RolesBadge roles={row.original.roles} />
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => format(row.original.createdAt || '', 'MMM, do yyyy hh:mm aaaa')
  },
]