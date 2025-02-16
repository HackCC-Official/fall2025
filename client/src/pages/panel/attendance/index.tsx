import { AttendanceSearch } from "@/features/attendance/components/attendance-search"
import PanelLayout from "../layout"
import { EventSelect } from "@/features/attendance/components/event-select"
import { AttendanceTab } from "@/features/attendance/components/attendance-tab"

export default function AttendancePage() {
  return (
    <div className="py-10">
      <h1 className="font-bold text-3xl">Attendance</h1>
      <div className="flex justify-between items-center mt-8">
        <AttendanceSearch />
        <EventSelect />
      </div>
      <AttendanceTab className="mt-4" />
    </div>
  )
}

AttendancePage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>