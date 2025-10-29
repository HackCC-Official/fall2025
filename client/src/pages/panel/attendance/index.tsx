import { InputSearch } from "@/components/input-search"
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
import { PanelHeader } from "@/components/panel-header"
import { QrCodeScanner, ScannerAction } from "@/features/qr-code/components/qr-code-scanner"
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
    d.account.email.includes(q) 
    || 
    (d.account.firstName ? d.account.firstName.includes(q) : false)
    || 
    (d.account.lastName ? d.account.lastName.includes(q) : false)
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <PanelHeader>Attendance</PanelHeader>
        <QrCodeScanner type={ScannerAction.ATTENDANCE} currentEvent={event} />
      </div>
      <div className="flex justify-between items-center gap-4 mt-4">
        <InputSearch q={q} setQ={debouncedSetQ} placeholder="Search attendances..." />
          <div className='md:hidden block w-full'>
            <EventSelect events={eventQuery.data || []} value={event} onClick={setEvent} />
          </div>
      </div>
      <div className="flex gap-4">
        <AttendanceTab 
          data={queriedData || []} isLoading={attendanceQuery.isLoading} className="mt-4" setStatus={setStatus} 
          EventSelect={
          <div className='hidden md:block'>
            <EventSelect events={eventQuery.data || []} value={event} onClick={setEvent} />
          </div>
          }
        />
      </div>
    </div>
  )
}

AttendancePage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>