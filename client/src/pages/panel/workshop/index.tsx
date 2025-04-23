import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Sheet } from "@/components/ui/sheet"
import PanelLayout from "../layout"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function WorkshopPage() {
  const [open, setOpen] = useState(false)
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
    </div>
  )
}

WorkshopPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>