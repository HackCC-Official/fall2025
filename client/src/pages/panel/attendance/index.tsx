import PanelLayout from "../layout"

export default function AttendancePage() {
  return (
    <div>
      Attendance
    </div>
  )
}

AttendancePage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>