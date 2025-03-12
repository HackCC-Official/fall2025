import { Button } from "@/components/ui/button"
import PanelLayout from "../layout"
import { Plus } from "lucide-react"
import { useRouter } from "next/router"
import { DataTable } from "@/components/data-table";
import { columns } from "@/features/account/components/account-table/columns";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/features/account/api/account";

export default function AccountPage() {
  const router = useRouter();
  const { isLoading, data } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts()
  })
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
      <DataTable isLoading={isLoading} data={data || []} columns={columns} />
    </div>
    </div>
  )
}

AccountPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>