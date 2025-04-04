import { useRouter } from "next/router"
import PanelLayout from "../layout"

export default function ApplicationDetailPage() {
  const router = useRouter()

  return (
    router.query.id 
  )
}

ApplicationDetailPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>