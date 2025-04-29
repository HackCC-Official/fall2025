import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ResponseMealAccountDTO } from "../../types/meal";
import { MealBadge } from "../meal-badge";

export const columns: ColumnDef<ResponseMealAccountDTO>[] = [
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
    accessorKey: 'meal',
    header: 'Meal',
    cell: ({row}) => <MealBadge mealType={row.original.mealType} />
  },
  {
    accessorKey: 'checkedInAt',
    header: 'Checked In',
    cell: ({row}) => row.original.checkedInAt ? format(row.original.checkedInAt, 'MMM, do yyyy hh:mm aaaa') : 'N/A'
  },
]