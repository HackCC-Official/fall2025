import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Sheet } from "@/components/ui/sheet"
import PanelLayout from "../layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/data-table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteWorkshop, getWorkshops } from "@/features/workshop/api/workshop"
import { columns } from "@/features/workshop/components/workshop-table/columns"
import { WorkshopForm } from "@/features/workshop/components/workshop-form"
import { WorkshopResponseDTO } from "@/features/workshop/types/workshop"

export default function WorkshopPage() {
  const [workshopId, setWorkshopId] = useState<string>('');
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['workshops'],
    queryFn: () => getWorkshops()
  })

  const deleteWorkshopMutation = useMutation({
    mutationFn: (teamId: string) => deleteWorkshop(teamId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['workshops'] })
    }
  })
  
  function onEdit(value: WorkshopResponseDTO) {
    setWorkshopId(value.id);
    setTimeout(() => {
      setOpen(true);
    }, 0);
  }

  function onDelete(value: WorkshopResponseDTO) {
    deleteWorkshopMutation.mutate(value.id)
  }

  return (
    <div>
      <h1 className="font-bold text-3xl">Workshop</h1>
      <div className="flex space-x-4 my-4">
        <Sheet open={open} onOpenChange={setOpen} modal={false}>
          <SheetTrigger asChild>
            <Button>
              <Plus />
              Create Workshop
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px]">
              <SheetHeader>
                <SheetTitle>Create Workshop</SheetTitle>
                <SheetDescription>
                  Create a workshop for the hackathon
                </SheetDescription>
              </SheetHeader>
              <Separator className="my-4" />
              <WorkshopForm 
                workshopId={workshopId}
                setWorkshopId={setWorkshopId}
                setOpen={setOpen} 
              />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable 
        columns={columns} 
        data={data || []}   
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
        enableRightClick 
      />
    </div>
  )
}

WorkshopPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>