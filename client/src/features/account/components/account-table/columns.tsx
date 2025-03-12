import { ColumnDef } from "@tanstack/react-table";
import { AccountDTO } from "../../types/account-dto";
import { RolesBadge } from "../roles-badge";

export const columns: ColumnDef<AccountDTO>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name'
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => <RolesBadge roles={row.original.roles} />
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At'
  }
]