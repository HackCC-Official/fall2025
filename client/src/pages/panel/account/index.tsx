import { Button } from "@/components/ui/button"
import PanelLayout from "../layout"
import { Plus } from "lucide-react"
import { DataTable } from "@/components/data-table";
import { columns } from "@/features/account/components/account-table/columns";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/features/account/api/account";
import { CreateAccountForm } from "@/features/account/components/create-account-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function AccountPage() {
  const [open, setOpen] = useState(false)
  const { isLoading, data } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts()
  })
  return (
    <div>
    <div className="py-10">
      <h1 className="font-bold text-3xl">Account</h1>
      <div className="flex space-x-4 my-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus />
              Create User
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px]">
              <SheetHeader>
                <SheetTitle>Create Account</SheetTitle>
                <SheetDescription>
                  Create an account to use for the hackathon
                </SheetDescription>
              </SheetHeader>
              <Separator className="my-4" />
              <CreateAccountForm setOpen={setOpen} />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable isLoading={isLoading} data={data || []} columns={columns} />
    </div>
    </div>
  )
}

AccountPage.getLayout = (page: React.ReactElement) => <PanelLayout>{page}</PanelLayout>