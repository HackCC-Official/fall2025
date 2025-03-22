import { AttendanceSearch } from "@/features/attendance/components/attendance-search"
import PanelLayout from "../layout"
import { EventSelect } from "@/features/attendance/components/event-select"
import { AttendanceTab } from "@/features/attendance/components/attendance-tab"
import { getEvents } from "@/features/event/api/event"
import { EventDTO } from "@/features/event/types/event-dto"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useQueries } from '@tanstack/react-query'
import { getAttendances } from "@/features/attendance/api/attendance"
import { AttendanceStatus } from "@/features/attendance/types/attendance-dto"
import { useDebounce } from 'use-debounce';
export default function AttendancePage() {
  const [q, setQ] = useState('');
  const [debouncedSetQ] = useDebounce(setQ, 500);
  const [event, setEvent] = useState<EventDTO>();
  const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.ALL);

  const [eventQuery, attendanceQuery] = useQueries({
    queries: [
      {
        queryKey: ['events'],
        queryFn: () => getEvents(),
      },
      {
        queryKey: ['attendances', event?.date || '', status],
        queryFn: () => getAttendances({
            event_id: event?.id,
            status: status
          })
      },
    ]
  })

  useEffect(() => {
    if (eventQuery.data) {
      const todayDate = format(new Date(), 'y-MM-dd');
      const todayEvent = eventQuery.data.find(d => d.date === todayDate)
      if (!event && todayEvent) {
        setEvent(todayEvent)
      }
    }
  }, [eventQuery, event])

  const queriedData = attendanceQuery.data?.filter(d => 
    d.account.email.includes(q) || 
    d.account.firstName.includes(q) || 
    d.account.lastName.includes(q)
  );

  return (
    <div className="py-10">
      <h1 className="font-bold text-3xl">Attendance</h1>
      <div className="flex justify-between items-center mt-8">
        <AttendanceSearch q={q} setQ={debouncedSetQ} />
        <EventSelect events={eventQuery.data || []} value={event} onClick={setEvent} />
      </div>
      <AttendanceTab data={queriedData || []} isLoading={attendanceQuery.isLoading} className="mt-4" setStatus={setStatus} />
    </div>
  )
}

AttendancePage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>