import { Button } from "@/components/ui/button"
import PanelLayout from "../layout"
import { Plus } from "lucide-react"
import { useRouter } from "next/router"

export default function AccountPage() {
  const router = useRouter();
  return (
    <div>
    <div className="py-10">
      <h1 className="font-bold text-3xl">Account</h1>
      <div className="flex space-x-4 my-4">
        <Button onClick={() => router.push('/panel/event/create')}>
          <Plus />
          Create User
        </Button>
      </div>
    </div>
    </div>
  )
}

AccountPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>