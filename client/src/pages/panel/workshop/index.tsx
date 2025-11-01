import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Sheet } from "@/components/ui/sheet"
import PanelLayout from "../layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Plus, Trash } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ContextOption, DataTable } from "@/components/data-table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteWorkshop, getWorkshops } from "@/features/workshop/api/workshop"
import { columns } from "@/features/workshop/components/workshop-table/columns"
import { WorkshopForm } from "@/features/workshop/components/workshop-form"
import { WorkshopResponseDTO } from "@/features/workshop/types/workshop"
import { QrCodeScanner, ScannerAction } from "@/features/qr-code/components/qr-code-scanner"
import { PanelHeader } from "@/components/panel-header"

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

  function onCreate() {
    setWorkshopId('');
    setTimeout(() => {
      setOpen(true);
    }, 0);
  }
  
  function onEdit(value: WorkshopResponseDTO) {
    setWorkshopId(value.id);
    setTimeout(() => {
      setOpen(true);
    }, 0);
  }

  const workshopContextOptions: ContextOption<WorkshopResponseDTO>[] = [
    {
      label: 'Edit workshop',
      icon: Edit,
      onClick: onEdit
    },
    {
      label: 'Delete workshop',
      icon: Trash,
      onClick: onDelete
    }
  ]
  

  function onDelete(value: WorkshopResponseDTO) {
    deleteWorkshopMutation.mutate(value.id)
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <PanelHeader>Workshop</PanelHeader>
      </div>
      <div className="flex space-x-4 my-4">
        <Sheet open={open} onOpenChange={setOpen} modal={false}>
          <SheetTrigger asChild>
            <Button onClick={onCreate}>
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
        contextOptions={workshopContextOptions} 
      />
    </div>
  )
}

WorkshopPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>