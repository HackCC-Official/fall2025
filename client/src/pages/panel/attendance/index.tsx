import PanelLayout from "../layout"

export default function AttendancePage() {
  return (
    <div className="py-10">
      <h1 className="font-bold text-xl">Attendance</h1>
    </div>
  )
}

AttendancePage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>