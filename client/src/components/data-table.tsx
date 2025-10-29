"use client"
 
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useMemo } from "react"
import { Skeleton } from "./ui/skeleton"
import { Button } from "./ui/button"
import { LucideIcon } from "lucide-react"
 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export interface ContextOption<TValue> {
  label: string;
  icon: LucideIcon;
  onClick: (value: TValue) => void;
}

interface CustomDataTableProps<TData, TValue> extends DataTableProps<TData, TValue> {
  isLoading?: boolean;
  contextOptions?: ContextOption<TValue>[];
}
 
export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  contextOptions,
}: CustomDataTableProps<TData, TValue>) {
  const tableData = useMemo(
    () => (isLoading ? Array(10).fill({}) : data),
    [isLoading, data]
  ); 

  const tableColumns = useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,
            cell: <Skeleton className="h-4" />,
          }))
        : columns,
    [isLoading, columns]
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns as ColumnDef<TData, TValue>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
 
  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                contextOptions && !isLoading
                ?
                  <ContextMenu key={row.id} >
                    <ContextMenuTrigger asChild>
                      <TableRow
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      {/* <ContextMenuItem onClick={() => onEdit(row.original as TValue)}><Edit className="mr-2 w-4 h-4" /> Edit</ContextMenuItem>
                      <ContextMenuItem onClick={() => onDelete(row.original as TValue)}><Trash2 className="mr-2 w-4 h-4" /> Delete</ContextMenuItem> */}
                      {
                        contextOptions.map(c => (
                          <ContextMenuItem
                            className="min-w-[200px] cursor-pointer"
                            key={c.label}
                            onClick={() => c.onClick(row.original as TValue)}
                          >
                            <c.icon className="mr-2 w-4 h-4" /> {c.label}
                          </ContextMenuItem>
                        ))
                      }
                    </ContextMenuContent>
                  </ContextMenu>
                :
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    </div>
      <div className="flex justify-end items-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  )
}