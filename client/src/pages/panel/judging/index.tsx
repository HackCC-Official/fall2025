import PanelLayout from "../layout"

export default function JudgingPage() {
  return (
    <div>
      Judging
    </div>
  )
}

JudgingPage.getLayout =(page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>