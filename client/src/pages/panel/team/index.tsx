import { DataTable } from "@/components/data-table";
import { getTeams } from "@/features/team/api/team";
import { columns } from "@/features/team/components/team-table/columns";
import { useQuery } from "@tanstack/react-query";
import PanelLayout from "../layout";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { TeamForm } from "@/features/team/components/team-form";

export default function TeamPage() {
  const [open, setOpen] = useState(false)
  const { isLoading, data } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams()
  })
  return (
    <div>
      <h1 className="font-bold text-3xl">Account</h1>
      <div className="flex space-x-4 my-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus />
              Create Team
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px]">
              <SheetHeader>
                <SheetTitle>Create Team</SheetTitle>
                <SheetDescription>
                  Create a team for the hackathon
                </SheetDescription>
              </SheetHeader>
              <Separator className="my-4" />
              <TeamForm setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable isLoading={isLoading} data={data || []} columns={columns} />
    </div>
  )
}

TeamPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>