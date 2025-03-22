import PanelLayout from "../layout";

export default function ApplicationPage() {
  return (
    <div>
      Application
    </div>
  )
}


ApplicationPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>