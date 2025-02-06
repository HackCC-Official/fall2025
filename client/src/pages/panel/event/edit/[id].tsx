import { useRouter } from "next/router"
import PanelLayout from "../../layout"

export default function EventEditPage() {
  const router = useRouter()
  return (
    <div>
      {router.query.id}
    </div>
  )
}

EventEditPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>