import { ContextOption, DataTable } from "@/components/data-table";
import { deleteTeam, getTeams } from "@/features/team/api/team";
import { columns } from "@/features/team/components/team-table/columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PanelLayout from "../layout";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Edit, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { TeamForm } from "@/features/team/components/team-form";
import { ResponseTeamDTO } from "@/features/team/type/team";

export default function TeamPage() {
  const [teamId, setTeamId] = useState<string>('');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { isLoading, data } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams()
  })

  const deleteTeamMutation = useMutation({
    mutationFn: (teamId: string) => deleteTeam(teamId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    }
  })

  function onCreate() {
    setTeamId('')
    setTimeout(() => {
      setOpen(true);
    }, 0);
  }
  
  function onEdit(value: ResponseTeamDTO) {
    setTeamId(value.id);
    setTimeout(() => {
      setOpen(true);
    }, 0);
  }

  function onDelete(value: ResponseTeamDTO) {
    deleteTeamMutation.mutate(value.id)
  }

  const teamContextOptions: ContextOption<ResponseTeamDTO>[] = [
    {
      label: 'Edit team',
      icon: Edit,
      onClick: onEdit
    },
    {
      label: 'Delete team',
      icon: Trash,
      onClick: onDelete
    }
  ]

  const createOrUpdate = teamId ? 'Update' : 'Create';

  return (
    <div>
      <h1 className="font-bold text-3xl">Team</h1>
      <div className="flex space-x-4 my-4">
        <Sheet open={open} onOpenChange={setOpen} modal={false}>
          <SheetTrigger asChild>
            <Button onClick={onCreate}>
              <Plus />
              Create Team
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px]">
              <SheetHeader>
                <SheetTitle>{createOrUpdate} Team</SheetTitle>
                <SheetDescription>
                  {createOrUpdate} a team for the hackathon
                </SheetDescription>
              </SheetHeader>
              <Separator className="my-4" />
              <TeamForm teamId={teamId} setTeamId={setTeamId} setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable 
        isLoading={isLoading} 
        data={data || []} 
        columns={columns} 
        contextOptions={teamContextOptions}
      />
    </div>
  )
}

TeamPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>