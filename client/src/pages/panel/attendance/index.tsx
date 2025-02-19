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
  const [event, setEvent] = useState<EventDTO>();
  const [status, setStatus] = useState<AttendanceStatus>();
  console.log(status)
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
    console.log(todayEvent)
    if (!event && todayEvent) {
      setEvent(todayEvent)
    }
  }, [events, event])

  return (
    <div className="py-10">
      <h1 className="font-bold text-3xl">Attendance</h1>
      <div className="flex justify-between items-center mt-8">
        <AttendanceSearch />
        <EventSelect events={events} value={event} onClick={setEvent} />
      </div>
      <AttendanceTab data={data || []} isLoading={isLoading} className="mt-4" setStatus={setStatus} />
    </div>
  )
}

AttendancePage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>