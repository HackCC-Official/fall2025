"use client"

import { ColumnDef } from "@tanstack/react-table"
import { EventDTO } from "../../types/event-dto"
import { format } from "date-fns";
import { ActiveBadge, InactiveBadge } from "@/components/status-badge";
import { EventActions } from "../event-actions";

export const columns: ColumnDef<EventDTO>[] = [
  {
    accessorKey: 'date',
    header: 'Event Date',
    cell: ({ row }) =>
      <div className="font-semibold">
        {row.original.date}
      </div>
  },
  {
    accessorKey: 'startingTime',
    header: 'Starting Time',
    cell: ({ row }) =>
      <div>
        {format(row.original.startingTime, 'p')}
      </div>
  },
  {
    accessorKey: 'lateTime',
    header: 'Late Time',
    cell: ({ row }) =>
      <div>
        {format(row.original.lateTime, 'p')}
      </div>
  },
  {
    accessorKey: 'endingTime',
    header: 'Ending Time',
    cell: ({ row }) =>
      <div>
        {format(row.original.endingTime, 'p')}
      </div>
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ row }) =>
      row.original.active
      ?
      <ActiveBadge />
      :
      <InactiveBadge />
  },
  {
    accessorKey: 'breakfast',
    header: 'Breakfast',
    cell: ({ row }) =>
      row.original.breakfast
      ?
      <ActiveBadge />
      :
      <InactiveBadge />
  },
  {
    accessorKey: 'lunch',
    header: 'Lunch',
    cell: ({ row }) =>
      row.original.lunch
      ?
      <ActiveBadge />
      :
      <InactiveBadge />
  },
  {
    accessorKey: 'dinner',
    header: 'Dinner',
    cell: ({ row }) =>
      row.original.dinner
      ?
      <ActiveBadge />
      :
      <InactiveBadge />
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) =>
      <EventActions event={row.original} />
  },
]