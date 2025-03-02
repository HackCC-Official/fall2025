import { AttendanceSearch } from "@/features/attendance/components/attendance-search"
import PanelLayout from "../layout"
import { EventSelect } from "@/features/attendance/components/event-select"
import { AttendanceTab } from "@/features/attendance/components/attendance-tab"
import { getEvents } from "@/features/event/api/event"
import { EventDTO } from "@/features/event/types/event-dto"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useQuery } from '@tanstack/react-query'
import { getAttendances } from "@/features/attendance/api/attendance"
import { AttendanceStatus } from "@/features/attendance/types/attendance-dto"
import { useDebounce } from 'use-debounce';

export const getServerSideProps = (async () => {
  try {
    const [events] = await Promise.all([
      getEvents()
    ])
    return { props: { events } }
  } catch (error) {
    console.error('Error fetching data during build:', error);
    return { props: { events: [] } };
  }
})

export default function AttendancePage({ events }: { events: EventDTO[]  }) {
  const [q, setQ] = useState('');
  const [debouncedSetQ] = useDebounce(setQ, 500);
  const [event, setEvent] = useState<EventDTO>();
  const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.ALL);
  
  const { isLoading, data } = useQuery({
    queryKey: ['attendances', event?.date || '', status],
    queryFn: () => getAttendances({
        event_id: event?.id,
        status: status
      })
  })

  useEffect(() => {
    const todayDate = format(new Date(), 'y-MM-dd');
    const todayEvent = events.find(d => d.date === todayDate)
    if (!event && todayEvent) {
      setEvent(todayEvent)
    }
  }, [events, event])

  const queriedData = data?.filter(d => 
    d.account.email.includes(q) || 
    d.account.firstName.includes(q) || 
    d.account.lastName.includes(q)
  );

  return (
    <div className="py-10">
      <h1 className="font-bold text-3xl">Attendance</h1>
      <div className="flex justify-between items-center mt-8">
        <AttendanceSearch q={q} setQ={debouncedSetQ} />
        <EventSelect events={events} value={event} onClick={setEvent} />
      </div>
      <AttendanceTab data={queriedData || []} isLoading={isLoading} className="mt-4" setStatus={setStatus} />
    </div>
  )
}

AttendancePage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>