import PanelLayout from "../layout"

export default function EmailPage() {
  return (
    <div>
      Email
    </div>
  )
}

EmailPage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>