import { DataTable } from "@/components/data-table";
import { getTeams } from "@/features/team/api/team";
import { columns } from "@/features/team/components/team-table/columns";
import { useQuery } from "@tanstack/react-query";
import PanelLayout from "../layout";

export default function TeamPage() {
  const { isLoading, data } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getTeams()
  })
  return (
    <div>
      <h1 className="font-bold text-3xl">Account</h1>
      <DataTable isLoading={isLoading} data={data || []} columns={columns} />
    </div>
  )
}

TeamPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>