import { ColumnDef } from "@tanstack/react-table";
import { AttendanceDTO } from "../../types/attendance-dto";

export const columns: ColumnDef<AttendanceDTO>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'account_id',
    header: 'Account Name'
  },
  {
    accessorKey: 'checkedInAt',
    header: 'Checked In At'
  }
]