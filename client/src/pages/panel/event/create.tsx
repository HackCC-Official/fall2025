import PanelLayout from "../layout"

export default function CreateEventPage() {
  return (
    <div>
      Create
    </div>
  )
}

CreateEventPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>