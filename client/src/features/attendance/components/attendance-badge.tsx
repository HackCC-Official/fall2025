import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";
import { AttendanceStatus } from "../types/attendance-dto";

export function FullRoundBadge({ className, children } : { className?: string, children?: React.ReactNode }) {
  return (
    <Badge className={cn([
      'rounded-full',
      className
    ])}>
      {children}
    </Badge>
  )
}

export function PresentBadge() {
  return (
    <FullRoundBadge className="bg-green-500 hover:bg-green-600">
      Present
    </FullRoundBadge>
  )
}

export function AbsentBadge() {
  return (
    <FullRoundBadge className="bg-red-500 hover:bg-red-600">
      Absent
    </FullRoundBadge>
  )
}

export function LateBadge() {
  return (
    <FullRoundBadge className="bg-amber-500 hover:bg-amber-600">
      Late
    </FullRoundBadge>
  )
}

export function AttendanceBadge({ status } : { status: AttendanceStatus }) {
  switch(status) {
    case AttendanceStatus.PRESENT:
      return <PresentBadge />
    case AttendanceStatus.LATE:
      return <LateBadge />
    default:
      return <AbsentBadge />
  }
}