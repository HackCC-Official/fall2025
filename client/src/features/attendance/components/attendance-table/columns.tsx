import { ColumnDef } from "@tanstack/react-table";
import { AttendanceDTO } from "../../types/attendance-dto";
import { AttendanceBadge } from "../attendance-badge";
import { format } from "date-fns";

export const columns: ColumnDef<AttendanceDTO>[] = [
  {
    accessorKey: 'account.firstName',
    header: 'First Name'
  },
  {
    accessorKey: 'account.lastName',
    header: 'Last Name'
  },
  {
    accessorKey: 'account.email',
    header: 'Email',
    cell: ({ row }) => <div className="font-semibold">{row.original.account.email}</div>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => <AttendanceBadge status={row.original.status} />
  },
  {
    accessorKey: 'checkedInAt',
    header: 'Checked In',
    cell: ({row}) => row.original.checkedInAt ? format(row.original.checkedInAt, 'MMM, do yyyy hh:mm aaaa') : 'N/A'
  },
]