import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Sheet } from "@/components/ui/sheet"
import PanelLayout from "../layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/data-table"
import { useQuery } from "@tanstack/react-query"
import { getWorkshops } from "@/features/workshop/api/workshop"
import { columns } from "@/features/workshop/components/workshop-table/columns"

export default function WorkshopPage() {
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useQuery({
    queryKey: ['workshops'],
    queryFn: () => getWorkshops()
  }) 
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
          </SheetContent>
        </Sheet>
      </div>
      <DataTable 
        columns={columns} 
        data={data || []}   
        isLoading={isLoading}
      />
    </div>
  )
}

WorkshopPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>