import { AttendanceSearch } from "@/features/attendance/components/attendance-search"
import PanelLayout from "../layout"
import { EventSelect } from "@/features/attendance/components/event-select"
import { AttendanceTab } from "@/features/attendance/components/attendance-tab"
import { getEvents } from "@/features/event/api/event"
import { EventDTO } from "@/features/event/types/event-dto"

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

export default function AttendancePage({ events }: { events: EventDTO[] }) {
  return (
    <div className="py-10">
      <h1 className="font-bold text-3xl">Attendance</h1>
      <div className="flex justify-between items-center mt-8">
        <AttendanceSearch />
        <EventSelect events={events} />
      </div>
      <AttendanceTab className="mt-4" />
    </div>
  )
}

AttendancePage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>