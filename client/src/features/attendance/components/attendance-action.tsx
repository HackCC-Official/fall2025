import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis, UserCheck } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { takeAttendance } from "../api/attendance";

interface AttendanceActionsProps {
  account_id: string,
  event_id: string;
}

export function AttendanceActions({ account_id, event_id }: AttendanceActionsProps) {
  const queryClient = useQueryClient();
  const takeAttendanceMutation = useMutation({
    mutationFn: async () => takeAttendance({ account_id, event_id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendances'] })
  });



  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button className="hover:bg-transparent focus-visible:ring-0 w-4 h-4 hover:text-primary" size='icon' variant='ghost'>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Sale Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            takeAttendanceMutation.mutate();
          }}>
            <UserCheck /> Take Attendance
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}